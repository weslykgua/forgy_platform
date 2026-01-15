import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// ==================== INTERFACES ====================
interface Exercise {
    id: string;
    name: string;
    muscle: string;
    video: string;
    description: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    equipment: string;
    instructions: string[];
    createdAt: string;
}

interface WorkoutLog {
    id: string;
    date: string; // YYYY-MM-DD
    exerciseId: string;
    exerciseName: string;
    sets: { reps: number; weight: number; completed: boolean }[];
    duration: number; // minutos
    notes: string;
    createdAt: string;
}

interface DailyProgress {
    id: string;
    date: string; // YYYY-MM-DD
    weight: number; // kg
    waterIntake: number; // ml
    caloriesConsumed: number;
    caloriesBurned: number;
    sleepHours: number;
    mood: 'Excelente' | 'Bien' | 'Regular' | 'Mal';
    notes: string;
    createdAt: string;
}

interface BodyMeasurement {
    id: string;
    date: string;
    chest: number;
    waist: number;
    hips: number;
    bicepLeft: number;
    bicepRight: number;
    thighLeft: number;
    thighRight: number;
    createdAt: string;
}

// ==================== DATABASES ====================
let exercisesDB: Exercise[] = [
    // PECHO
    {
        id: '1',
        name: 'Press Banca',
        muscle: 'Pecho',
        video: 'https://www.youtube.com/watch?v=example1',
        description: 'Ejercicio fundamental para desarrollar el pecho',
        difficulty: 'Intermedio',
        equipment: 'Barra y banco',
        instructions: ['Acuéstate en el banco', 'Agarra la barra con las manos separadas', 'Baja la barra al pecho', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Press Inclinado',
        muscle: 'Pecho',
        video: '',
        description: 'Enfocado en la parte superior del pecho',
        difficulty: 'Intermedio',
        equipment: 'Mancuernas y banco inclinado',
        instructions: ['Ajusta el banco a 30-45 grados', 'Toma las mancuernas', 'Baja controladamente', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Aperturas con Mancuernas',
        muscle: 'Pecho',
        video: '',
        description: 'Estiramiento y contracción máxima del pecho',
        difficulty: 'Principiante',
        equipment: 'Mancuernas y banco',
        instructions: ['Acuéstate en el banco', 'Brazos extendidos con mancuernas', 'Abre los brazos en arco', 'Junta las mancuernas arriba'],
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Fondos en Paralelas',
        muscle: 'Pecho',
        video: '',
        description: 'Ejercicio de peso corporal para pecho inferior',
        difficulty: 'Intermedio',
        equipment: 'Barras paralelas',
        instructions: ['Agarra las barras', 'Inclínate hacia adelante', 'Baja flexionando codos', 'Sube hasta extender brazos'],
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Flexiones',
        muscle: 'Pecho',
        video: '',
        description: 'Clásico ejercicio de peso corporal',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Posición de plancha', 'Manos al ancho de hombros', 'Baja el pecho al suelo', 'Empuja hacia arriba'],
        createdAt: new Date().toISOString()
    },
    // ESPALDA
    {
        id: '6',
        name: 'Peso Muerto',
        muscle: 'Espalda',
        video: '',
        description: 'Ejercicio compuesto para espalda baja y piernas',
        difficulty: 'Avanzado',
        equipment: 'Barra',
        instructions: ['Párate frente a la barra', 'Agarra con agarre mixto', 'Levanta manteniendo espalda recta', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Dominadas',
        muscle: 'Espalda',
        video: '',
        description: 'El mejor ejercicio para espalda ancha',
        difficulty: 'Intermedio',
        equipment: 'Barra de dominadas',
        instructions: ['Agarra la barra', 'Cuelga con brazos extendidos', 'Sube hasta que la barbilla pase la barra', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Remo con Barra',
        muscle: 'Espalda',
        video: '',
        description: 'Desarrollo de grosor en la espalda',
        difficulty: 'Intermedio',
        equipment: 'Barra',
        instructions: ['Inclínate 45 grados', 'Agarra la barra', 'Tira hacia el abdomen', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '9',
        name: 'Jalón al Pecho',
        muscle: 'Espalda',
        video: '',
        description: 'Alternativa a dominadas en polea',
        difficulty: 'Principiante',
        equipment: 'Máquina de polea alta',
        instructions: ['Siéntate en la máquina', 'Agarra la barra ancha', 'Tira hacia el pecho', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '10',
        name: 'Remo con Mancuerna',
        muscle: 'Espalda',
        video: '',
        description: 'Trabajo unilateral de espalda',
        difficulty: 'Principiante',
        equipment: 'Mancuerna y banco',
        instructions: ['Apoya rodilla y mano en banco', 'Toma mancuerna con otra mano', 'Tira hacia la cadera', 'Baja estirando'],
        createdAt: new Date().toISOString()
    },
    // PIERNAS
    {
        id: '11',
        name: 'Sentadilla',
        muscle: 'Piernas',
        video: '',
        description: 'El rey de los ejercicios para piernas',
        difficulty: 'Intermedio',
        equipment: 'Barra y rack',
        instructions: ['Coloca la barra sobre los hombros', 'Separa los pies al ancho de hombros', 'Baja flexionando rodillas', 'Sube empujando con los talones'],
        createdAt: new Date().toISOString()
    },
    {
        id: '12',
        name: 'Prensa de Piernas',
        muscle: 'Piernas',
        video: '',
        description: 'Desarrollo de cuádriceps con soporte',
        difficulty: 'Principiante',
        equipment: 'Máquina de prensa',
        instructions: ['Siéntate en la máquina', 'Coloca pies en la plataforma', 'Baja flexionando rodillas', 'Empuja sin bloquear'],
        createdAt: new Date().toISOString()
    },
    {
        id: '13',
        name: 'Zancadas',
        muscle: 'Piernas',
        video: '',
        description: 'Trabajo unilateral de piernas y glúteos',
        difficulty: 'Principiante',
        equipment: 'Mancuernas (opcional)',
        instructions: ['De pie, da un paso adelante', 'Baja hasta que ambas rodillas formen 90°', 'Empuja para volver', 'Alterna piernas'],
        createdAt: new Date().toISOString()
    },
    {
        id: '14',
        name: 'Extensión de Cuádriceps',
        muscle: 'Piernas',
        video: '',
        description: 'Aislamiento de cuádriceps',
        difficulty: 'Principiante',
        equipment: 'Máquina de extensión',
        instructions: ['Siéntate en la máquina', 'Ajusta el rodillo en tobillos', 'Extiende las piernas', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '15',
        name: 'Curl de Isquiotibiales',
        muscle: 'Piernas',
        video: '',
        description: 'Aislamiento de isquiotibiales',
        difficulty: 'Principiante',
        equipment: 'Máquina de curl',
        instructions: ['Acuéstate boca abajo', 'Coloca tobillos bajo el rodillo', 'Flexiona las piernas', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '16',
        name: 'Elevación de Talones',
        muscle: 'Piernas',
        video: '',
        description: 'Desarrollo de pantorrillas',
        difficulty: 'Principiante',
        equipment: 'Máquina o escalón',
        instructions: ['Párate en el borde', 'Baja los talones', 'Sube en puntas', 'Mantén arriba 1 segundo'],
        createdAt: new Date().toISOString()
    },
    // HOMBROS
    {
        id: '17',
        name: 'Press Militar',
        muscle: 'Hombros',
        video: '',
        description: 'Desarrollo de hombros con barra',
        difficulty: 'Intermedio',
        equipment: 'Barra',
        instructions: ['Barra a la altura del pecho', 'Empuja hacia arriba', 'Extiende completamente', 'Baja a la posición inicial'],
        createdAt: new Date().toISOString()
    },
    {
        id: '18',
        name: 'Elevaciones Laterales',
        muscle: 'Hombros',
        video: '',
        description: 'Aislamiento del deltoides lateral',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['De pie con mancuernas', 'Eleva los brazos a los lados', 'Sube hasta altura de hombros', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '19',
        name: 'Elevaciones Frontales',
        muscle: 'Hombros',
        video: '',
        description: 'Trabajo del deltoides frontal',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['De pie con mancuernas', 'Eleva un brazo al frente', 'Sube hasta altura de ojos', 'Baja y alterna'],
        createdAt: new Date().toISOString()
    },
    {
        id: '20',
        name: 'Pájaros',
        muscle: 'Hombros',
        video: '',
        description: 'Trabajo del deltoides posterior',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Inclínate hacia adelante', 'Brazos colgando', 'Eleva hacia los lados', 'Aprieta escápulas arriba'],
        createdAt: new Date().toISOString()
    },
    // BÍCEPS
    {
        id: '21',
        name: 'Curl de Bíceps',
        muscle: 'Bíceps',
        video: '',
        description: 'Ejercicio clásico para bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Párate con mancuernas a los lados', 'Flexiona los codos subiendo el peso', 'Aprieta en la parte superior', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '22',
        name: 'Curl con Barra',
        muscle: 'Bíceps',
        video: '',
        description: 'Desarrollo de masa en bíceps',
        difficulty: 'Principiante',
        equipment: 'Barra recta o Z',
        instructions: ['Agarra la barra', 'Codos pegados al cuerpo', 'Flexiona hasta arriba', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '23',
        name: 'Curl Martillo',
        muscle: 'Bíceps',
        video: '',
        description: 'Trabajo de braquial y bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuernas',
        instructions: ['Mancuernas con agarre neutro', 'Sube manteniendo el agarre', 'Contrae arriba', 'Baja lentamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '24',
        name: 'Curl Concentrado',
        muscle: 'Bíceps',
        video: '',
        description: 'Máxima contracción del bíceps',
        difficulty: 'Principiante',
        equipment: 'Mancuerna',
        instructions: ['Sentado, codo en muslo', 'Toma la mancuerna', 'Flexiona completamente', 'Baja estirando'],
        createdAt: new Date().toISOString()
    },
    // TRÍCEPS
    {
        id: '25',
        name: 'Extensión de Tríceps',
        muscle: 'Tríceps',
        video: '',
        description: 'Extensión en polea para tríceps',
        difficulty: 'Principiante',
        equipment: 'Polea',
        instructions: ['Agarra la cuerda', 'Codos pegados al cuerpo', 'Extiende hacia abajo', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '26',
        name: 'Press Francés',
        muscle: 'Tríceps',
        video: '',
        description: 'Excelente para la cabeza larga del tríceps',
        difficulty: 'Intermedio',
        equipment: 'Barra Z o mancuernas',
        instructions: ['Acostado en banco', 'Barra sobre el pecho', 'Baja hacia la frente', 'Extiende los brazos'],
        createdAt: new Date().toISOString()
    },
    {
        id: '27',
        name: 'Fondos en Banco',
        muscle: 'Tríceps',
        video: '',
        description: 'Ejercicio de peso corporal para tríceps',
        difficulty: 'Principiante',
        equipment: 'Banco',
        instructions: ['Manos en el banco atrás', 'Piernas extendidas', 'Baja flexionando codos', 'Sube hasta extender'],
        createdAt: new Date().toISOString()
    },
    {
        id: '28',
        name: 'Patada de Tríceps',
        muscle: 'Tríceps',
        video: '',
        description: 'Aislamiento del tríceps',
        difficulty: 'Principiante',
        equipment: 'Mancuerna',
        instructions: ['Inclínate apoyado', 'Codo a 90 grados', 'Extiende el brazo atrás', 'Regresa controladamente'],
        createdAt: new Date().toISOString()
    },
    // ABDOMINALES
    {
        id: '29',
        name: 'Crunch Abdominal',
        muscle: 'Abdomen',
        video: '',
        description: 'Ejercicio básico de abdominales',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Acostado boca arriba', 'Rodillas flexionadas', 'Sube el torso', 'Baja controladamente'],
        createdAt: new Date().toISOString()
    },
    {
        id: '30',
        name: 'Plancha',
        muscle: 'Abdomen',
        video: '',
        description: 'Fortalecimiento del core completo',
        difficulty: 'Principiante',
        equipment: 'Ninguno',
        instructions: ['Apóyate en antebrazos', 'Cuerpo en línea recta', 'Contrae el abdomen', 'Mantén la posición'],
        createdAt: new Date().toISOString()
    },
    {
        id: '31',
        name: 'Elevación de Piernas',
        muscle: 'Abdomen',
        video: '',
        description: 'Trabajo del abdomen inferior',
        difficulty: 'Intermedio',
        equipment: 'Ninguno o barra',
        instructions: ['Colgado o acostado', 'Piernas juntas', 'Eleva las piernas', 'Baja sin tocar suelo'],
        createdAt: new Date().toISOString()
    },
    {
        id: '32',
        name: 'Russian Twist',
        muscle: 'Abdomen',
        video: '',
        description: 'Trabajo de oblicuos',
        difficulty: 'Principiante',
        equipment: 'Peso opcional',
        instructions: ['Sentado, espalda a 45°', 'Pies elevados', 'Gira el torso lado a lado', 'Toca el suelo cada lado'],
        createdAt: new Date().toISOString()
    }
];

let workoutLogsDB: WorkoutLog[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        exerciseId: '1',
        exerciseName: 'Press Banca',
        sets: [
            { reps: 12, weight: 60, completed: true },
            { reps: 10, weight: 70, completed: true },
            { reps: 8, weight: 80, completed: true }
        ],
        duration: 15,
        notes: 'Buen entrenamiento',
        createdAt: new Date().toISOString()
    }
];

let dailyProgressDB: DailyProgress[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        weight: 75,
        waterIntake: 2500,
        caloriesConsumed: 2200,
        caloriesBurned: 500,
        sleepHours: 7,
        mood: 'Bien',
        notes: 'Día productivo',
        createdAt: new Date().toISOString()
    }
];

let bodyMeasurementsDB: BodyMeasurement[] = [];

// ==================== HELPERS ====================
const getStats = () => {
    const byMuscle: { [key: string]: number } = {};
    const byDifficulty: { [key: string]: number } = {};

    exercisesDB.forEach(ex => {
        byMuscle[ex.muscle] = (byMuscle[ex.muscle] || 0) + 1;
        byDifficulty[ex.difficulty] = (byDifficulty[ex.difficulty] || 0) + 1;
    });

    return {
        totalExercises: exercisesDB.length,
        byMuscle,
        byDifficulty
    };
};

const getProgressStats = () => {
    const totalWorkouts = workoutLogsDB.length;
    const totalVolume = workoutLogsDB.reduce((acc, log) => {
        return acc + log.sets.reduce((setAcc, set) => setAcc + (set.reps * set.weight), 0);
    }, 0);

    const avgWater = dailyProgressDB.length > 0
        ? dailyProgressDB.reduce((acc, p) => acc + p.waterIntake, 0) / dailyProgressDB.length
        : 0;

    // Ordenar por fecha y obtener historial de peso (solo donde hay peso registrado)
    const weightHistory = dailyProgressDB
        .filter(p => p.weight && p.weight > 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(p => ({ date: p.date, weight: p.weight }));

    // Calcular racha de días
    const today = new Date();
    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasActivity = workoutLogsDB.some(w => w.date === dateStr) ||
            dailyProgressDB.some(p => p.date === dateStr);
        if (hasActivity) {
            streakDays++;
        } else if (i > 0) {
            break;
        }
    }

    return {
        totalWorkouts,
        totalVolume: Math.round(totalVolume),
        avgWater: Math.round(avgWater),
        weightHistory,
        currentWeight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0,
        streakDays
    };
};

// Obtener Records Personales (PRs)
const getPersonalRecords = () => {
    const prs: { [exerciseId: string]: { exerciseName: string; maxWeight: number; maxVolume: number; date: string } } = {};

    workoutLogsDB.forEach(workout => {
        const maxSetWeight = Math.max(...workout.sets.map(s => s.weight));
        const workoutVolume = workout.sets.reduce((acc, s) => acc + (s.reps * s.weight), 0);

        if (!prs[workout.exerciseId] || maxSetWeight > prs[workout.exerciseId].maxWeight) {
            prs[workout.exerciseId] = {
                exerciseName: workout.exerciseName,
                maxWeight: maxSetWeight,
                maxVolume: workoutVolume,
                date: workout.date
            };
        }
    });

    return Object.values(prs).sort((a, b) => b.maxWeight - a.maxWeight);
};

// Obtener historial de entrenamientos agrupado
const getWorkoutHistory = () => {
    const grouped: { [date: string]: { workouts: WorkoutLog[]; totalVolume: number; totalDuration: number } } = {};

    workoutLogsDB.forEach(workout => {
        if (!grouped[workout.date]) {
            grouped[workout.date] = { workouts: [], totalVolume: 0, totalDuration: 0 };
        }
        grouped[workout.date].workouts.push(workout);
        grouped[workout.date].totalVolume += workout.sets.reduce((acc, s) => acc + (s.reps * s.weight), 0);
        grouped[workout.date].totalDuration += workout.duration;
    });

    return Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 30)
        .map(([date, data]) => ({
            date,
            exerciseCount: data.workouts.length,
            totalVolume: Math.round(data.totalVolume),
            totalDuration: data.totalDuration,
            workouts: data.workouts
        }));
};

// ==================== ROUTES ====================
app.get('/', (req: Request, res: Response) => {
    res.send('🏋️ API Forgy - Plataforma de Ejercicios');
});

// ========== EXERCISES ==========
app.get('/exercises', (req: Request, res: Response) => {
    const { muscle, difficulty, search } = req.query;
    let filtered = [...exercisesDB];

    if (muscle && muscle !== 'Todos') {
        filtered = filtered.filter(ex => ex.muscle === muscle);
    }
    if (difficulty && difficulty !== 'Todos') {
        filtered = filtered.filter(ex => ex.difficulty === difficulty);
    }
    if (search) {
        const searchLower = (search as string).toLowerCase();
        filtered = filtered.filter(ex =>
            ex.name.toLowerCase().includes(searchLower) ||
            ex.description.toLowerCase().includes(searchLower)
        );
    }
    res.json(filtered);
});

app.get('/exercises/stats', (req: Request, res: Response) => {
    res.json(getStats());
});

app.get('/exercises/:id', (req: Request, res: Response) => {
    const exercise = exercisesDB.find(ex => ex.id === req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado' });
    res.json(exercise);
});

app.post('/exercises', (req: Request, res: Response) => {
    const newExercise: Exercise = {
        id: Date.now().toString(),
        name: req.body.name,
        muscle: req.body.muscle,
        video: req.body.video || '',
        description: req.body.description || '',
        difficulty: req.body.difficulty || 'Principiante',
        equipment: req.body.equipment || '',
        instructions: req.body.instructions || [],
        createdAt: new Date().toISOString()
    };
    exercisesDB.push(newExercise);
    io.emit('exercises-updated', { action: 'created', exercise: newExercise });
    res.status(201).json(newExercise);
});

app.put('/exercises/:id', (req: Request, res: Response) => {
    const index = exercisesDB.findIndex(ex => ex.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' });

    exercisesDB[index] = { ...exercisesDB[index], ...req.body };
    io.emit('exercises-updated', { action: 'updated', exercise: exercisesDB[index] });
    res.json(exercisesDB[index]);
});

app.delete('/exercises/:id', (req: Request, res: Response) => {
    const index = exercisesDB.findIndex(ex => ex.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' });

    const deleted = exercisesDB.splice(index, 1)[0];
    io.emit('exercises-updated', { action: 'deleted', exerciseId: req.params.id });
    res.json({ message: 'Ejercicio eliminado', exercise: deleted });
});

// ========== WORKOUT LOGS ==========
app.get('/workouts', (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;
    let filtered = [...workoutLogsDB];

    if (date) {
        filtered = filtered.filter(w => w.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter(w => w.date >= startDate && w.date <= endDate);
    }
    res.json(filtered);
});

app.get('/workouts/history', (req: Request, res: Response) => {
    res.json(getWorkoutHistory());
});

app.get('/workouts/prs', (req: Request, res: Response) => {
    res.json(getPersonalRecords());
});

app.get('/workouts/calendar', (req: Request, res: Response) => {
    const { month, year } = req.query;
    const workoutDates = workoutLogsDB.map(w => w.date);
    const progressDates = dailyProgressDB.map(p => p.date);

    const calendar: { [date: string]: { hasWorkout: boolean; hasProgress: boolean } } = {};

    workoutDates.forEach(d => {
        if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasWorkout = true;
    });

    progressDates.forEach(d => {
        if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasProgress = true;
    });

    res.json(calendar);
});

app.get('/workouts/:id', (req: Request, res: Response) => {
    const workout = workoutLogsDB.find(w => w.id === req.params.id);
    if (!workout) return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    res.json(workout);
});

app.post('/workouts', (req: Request, res: Response) => {
    const newWorkout: WorkoutLog = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        exerciseId: req.body.exerciseId,
        exerciseName: req.body.exerciseName,
        sets: req.body.sets || [],
        duration: req.body.duration || 0,
        notes: req.body.notes || '',
        createdAt: new Date().toISOString()
    };
    workoutLogsDB.push(newWorkout);
    io.emit('workouts-updated');
    res.status(201).json(newWorkout);
});

app.put('/workouts/:id', (req: Request, res: Response) => {
    const index = workoutLogsDB.findIndex(w => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' });

    workoutLogsDB[index] = { ...workoutLogsDB[index], ...req.body };
    io.emit('workouts-updated');
    res.json(workoutLogsDB[index]);
});

app.delete('/workouts/:id', (req: Request, res: Response) => {
    const index = workoutLogsDB.findIndex(w => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' });

    const deleted = workoutLogsDB.splice(index, 1)[0];
    io.emit('workouts-updated');
    res.json({ message: 'Entrenamiento eliminado', workout: deleted });
});

// ========== DAILY PROGRESS ==========
app.get('/progress', (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;
    let filtered = [...dailyProgressDB];

    if (date) {
        filtered = filtered.filter(p => p.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter(p => p.date >= startDate && p.date <= endDate);
    }
    res.json(filtered);
});

app.get('/progress/stats', (req: Request, res: Response) => {
    res.json(getProgressStats());
});

app.get('/progress/:date', (req: Request, res: Response) => {
    const progress = dailyProgressDB.find(p => p.date === req.params.date);
    if (!progress) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(progress);
});

app.post('/progress', (req: Request, res: Response) => {
    const existingIndex = dailyProgressDB.findIndex(p => p.date === req.body.date);

    if (existingIndex !== -1) {
        // Actualizar si ya existe para esa fecha
        dailyProgressDB[existingIndex] = { ...dailyProgressDB[existingIndex], ...req.body };
        io.emit('progress-updated');
        return res.json(dailyProgressDB[existingIndex]);
    }

    const newProgress: DailyProgress = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        weight: req.body.weight || 0,
        waterIntake: req.body.waterIntake || 0,
        caloriesConsumed: req.body.caloriesConsumed || 0,
        caloriesBurned: req.body.caloriesBurned || 0,
        sleepHours: req.body.sleepHours || 0,
        mood: req.body.mood || 'Bien',
        notes: req.body.notes || '',
        createdAt: new Date().toISOString()
    };
    dailyProgressDB.push(newProgress);
    io.emit('progress-updated');
    res.status(201).json(newProgress);
});

app.delete('/progress/:id', (req: Request, res: Response) => {
    const index = dailyProgressDB.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Registro no encontrado' });

    const deleted = dailyProgressDB.splice(index, 1)[0];
    io.emit('progress-updated');
    res.json({ message: 'Registro eliminado', progress: deleted });
});

// ========== BODY MEASUREMENTS ==========
app.get('/measurements', (req: Request, res: Response) => {
    res.json(bodyMeasurementsDB);
});

app.post('/measurements', (req: Request, res: Response) => {
    const newMeasurement: BodyMeasurement = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        chest: req.body.chest || 0,
        waist: req.body.waist || 0,
        hips: req.body.hips || 0,
        bicepLeft: req.body.bicepLeft || 0,
        bicepRight: req.body.bicepRight || 0,
        thighLeft: req.body.thighLeft || 0,
        thighRight: req.body.thighRight || 0,
        createdAt: new Date().toISOString()
    };
    bodyMeasurementsDB.push(newMeasurement);
    io.emit('measurements-updated');
    res.status(201).json(newMeasurement);
});

// ========== SOCKET.IO ==========
io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);
    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🏋️ Servidor Forgy corriendo en http://localhost:${PORT}`);
    console.log(`📊 ${exercisesDB.length} ejercicios cargados`);
});