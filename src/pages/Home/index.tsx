import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, TaskInput } from "./style";
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useState } from "react";


const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, "Informe a tarefa."),
	minutesAmount: 
	zod.number()
	.min(5,"O ciclo deve ser de no mínimo 5 minutos.")
	.max(60, "O ciclo deve ser de no máximo 60 minutos.")
})

type NewCycleSchema = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
	id:string 
	task:string 
	minutesAmount:number
}

export function Home(){
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null) 
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
	const { register, handleSubmit, watch, reset} = useForm<NewCycleSchema>({
		resolver:zodResolver(newCycleFormValidationSchema),
		defaultValues:{
			minutesAmount:0,
			task:'',
			
		}	
	})

	const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);
	const totalSeconds = activeCycle? activeCycle.minutesAmount * 60 : 0;
	const currentSeconds = activeCycle? totalSeconds - amountSecondsPassed : 0;
	const minutesAmountCurrent = Math.floor(currentSeconds/60);
	const secondsAmount = currentSeconds % 60;
	const minutes = String(minutesAmountCurrent).padStart(2, '0')
	const seconds = String(secondsAmount).padStart(2, '0')
	const task = watch('task')
	const minutesAmount = watch('minutesAmount')
	const isSubmitDisabled = (!task || minutesAmount <5)?true:false
	

	function handleCreateNewCycle(data:NewCycleSchema) {
		const newCycle:Cycle = {
			id:String(new Date().getTime()),
			task:data.task,
			minutesAmount:data.minutesAmount
		}
		setCycles((state) => [...state, newCycle])
		setActiveCycleId(newCycle.id)
		reset()
	}
	
	return (
		<HomeContainer>
			<form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
				<FormContainer>
					<label htmlFor="task">Vou trabalhar em</label>
					<TaskInput 
						type="text" 
						id="task" 
						placeholder="Dê um nome para o seu projeto"
						list="task-suggestions"
						{...register("task")}
					 />
					 <datalist id="task-suggestions">
						<option value="Projeto 1"></option>
						<option value="Projeto 2"></option>
						<option value="Projeto 3"></option>
						<option value="banana"></option>
					 </datalist>

					<label htmlFor="minutesAmount">durante</label>
					<MinutesAmountInput 
						placeholder="00" 
						type="number" 
						id="minutesAmount" 
						step={5}
						min={5}
						max={60}
						
						{...register("minutesAmount", {valueAsNumber:true})}
					/>

					<span>minutos.</span>
				</FormContainer>
				<CountDownContainer>
					<span>{minutes[0]}</span>
					<span>{minutes[1]}</span>
					<Separator>:</Separator>
					<span>{seconds[0]}</span>
					<span>{seconds[1]}</span>
				</CountDownContainer>
				<StartCountDownButton disabled={isSubmitDisabled} type="submit">
					<Play size={24}/>
					Começar
				</StartCountDownButton>
			</form>
		</HomeContainer>
	);
}