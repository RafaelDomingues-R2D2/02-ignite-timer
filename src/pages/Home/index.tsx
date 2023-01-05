import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as zod from "zod"

import { 
    HomeContainer, 
    StartCountDownButton,
    StopCountDownButton, 
} from "./styles";
import { NewCycleForm } from "./Components/NewCycleForm";
import { Countdown } from "./Components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";
import { useContext } from "react";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "O ciclo precisa ser de no mínimo 5 minutos")
        .max(60, "O ciclo precisa ser de no máximo 60 minutos")
})

type NewCyrcleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
    const {activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

     const newCycleForm = useForm<NewCyrcleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    function handleCreateNewCycle(data: NewCyrcleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch("task")
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                { activeCycle ? (
                <StopCountDownButton onClick={interruptCurrentCycle} type="button">
                    <HandPalm size={24}/>
                    Interromper
                </StopCountDownButton>
            ): (
                <StartCountDownButton  disabled={isSubmitDisabled}  type="submit">
                    <Play size={24}/>
                    Começar
                </StartCountDownButton>
            )}
            </form>

        </HomeContainer>
    )
}