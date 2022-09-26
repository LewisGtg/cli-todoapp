import inquirer from "inquirer";
import chalk from "chalk";
import * as fs from "node:fs";

function app() {
    // create a json file if dont have one yet
    createDatabase();

    // options to user choose
    inquirer.prompt(
        [
            {
                type: "list",
                name: "option",
                message: "🖊️  TodoApp",
                choices: [
                    "Adicionar tarefa.",
                    "Listar tarefas.",
                    "Remover tarefa."
                ]
            },
        ]
    )
    .then(answer => {
        const option = answer["option"];

        if (option === "Adicionar tarefa.")
            addTask();
    })
}

function addTask() {
    inquirer.prompt(
        [
            {
                name: "task",
                message: "➕ Digite a tarefa que deseja adicionar:"
            }
        ]
    )
    .then(answer => {
        const task = answer["task"];

        const data = openData();
        const tasks = data.tasks;

        tasks.push(
            {
                id: tasks.length,
                task: task
            }
        )

        data.tasks = tasks;
        
        fs.writeFileSync(
            'data.json', 
            JSON.stringify(data, null, 4), 
            err => console.log(err)    
        );

        app();   
    })
}

function openData() {
    if (!fs.existsSync)
        createDatabase();

    const data = fs.readFileSync(
        "data.json",
        {
            encoding: "utf-8",
            flag: "r"
        }, 
        err => console.log(err)
        );

    return JSON.parse(data);
}

function createDatabase() {
    if (fs.existsSync("data.json"))
        return;

    const model = {
        tasks: []
    }

    fs.writeFileSync(
        "data.json",
        JSON.stringify(model, null, 4),
        err => console.log(err)
    );
}

app()