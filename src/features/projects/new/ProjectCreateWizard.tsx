import { Dialog, DialogBody, DialogFooter, DialogHeader } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { ProjectDraftProvider, useProjectDraft } from './useProjectDraft'
import Step1ProjectDetails from './steps/Step1ProjectDetails'
import { Stepper } from './components/Stepper'
import Step2RiskAssessment from './steps/Step2RiskAssessment'
import Step3AssignUpload from './steps/Step3AssignUpload'

function WizardInner({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const { draft, setStep } = useProjectDraft()
  const titleValid = draft.title.trim().length > 0
  const hasRisk = !!draft.riskAnswer
  
  return (
    <>
      <Stepper
        current={draft.step}
        onStepClick={(s) => {
          if (s === 1) return setStep(1)
          if (s === 2 && titleValid) return setStep(2)
          if (s === 3 && titleValid && hasRisk) return setStep(3)
        }}
        allowAdvance={titleValid}
      />
      <DialogBody>
        {draft.step === 1 && <Step1ProjectDetails />}
        {draft.step === 2 && <Step2RiskAssessment />}
        {draft.step === 3 && <Step3AssignUpload />}
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} aria-label="Cancel create project">
          Cancel
        </Button>
        {draft.step > 1 && (
          <Button 
            variant="secondary" 
            onClick={() => setStep((draft.step - 1) as 1 | 2 | 3)} 
            aria-label="Back to previous step"
          >
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            if (draft.step === 1) return setStep(2)
            if (draft.step === 2) return setStep(3)
            return onComplete()
          }}
          disabled={(draft.step === 1 && !titleValid) || (draft.step === 2 && !hasRisk)}
          aria-label={draft.step === 3 ? 'Submit project' : 'Next step'}
        >
          {draft.step === 3 ? 'Submit' : 'Next'}
        </Button>
      </DialogFooter>
    </>
  )
}

export default function ProjectCreateWizard({ 
  open, 
  onOpenChange, 
  onComplete 
}: { 
  open: boolean
  onOpenChange: (v: boolean) => void
  onComplete?: () => void 
}) {
  return (
    <ProjectDraftProvider>
      <Dialog 
        open={open} 
        onOpenChange={onOpenChange}
        ariaLabelledby="create-project-title"
      >
        <DialogHeader 
          id="create-project-title" 
          title="Create New Project" 
          onClose={() => onOpenChange(false)} 
        />
        <WizardInner 
          onClose={() => onOpenChange(false)} 
          onComplete={() => { 
            onComplete?.()
            onOpenChange(false)
          }} 
        />
      </Dialog>
    </ProjectDraftProvider>
  )
}