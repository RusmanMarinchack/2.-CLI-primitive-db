// node modules
const inquirer = require('inquirer');
const fs = require('fs');
const { tree } = require('gulp');

// Робимо перевірку чи існує файл users.txt, якщо ні, створюємо файл.
if (fs.existsSync('users.txt') === false) {
    fs.writeFileSync('users.txt', '[]')
}

// Получаємо файл.
let users = JSON.parse(fs.readFileSync('users.txt', 'utf8'))

async function generationUsers() { 
    await inquirer.prompt([])

    .then(async () => {
        await exifCreate()
    })

    async function exifCreate() {
        let gender;
        let name;
        let age;
        let search;
        let goSearch;

        name = await inquirer.prompt([
            {  
                name: "name",
                message: "Enter users name. To cancel press ENTER:",
                type: 'input',
              },
        ])

        // Якщо не вели імя, то задаємо підсказку чи юзер хоче використати пошук чи вийти.
        if (name.name === '') {
            
            goSearch = await inquirer.prompt([
                {  
                    name: "goSearch",
                    message: "Would you to search values DB:",
                    type: 'confirm',
                  },
            ])

            console.log(users)

            // Пошук в базі даних.
            if(goSearch.goSearch === true) {
                // Зміна якащо не має такого імені в базі.
                let noResult = true;

                // Підсказка для пошуку.
                search = await inquirer.prompt([
                    {  
                        name: "search",
                        message: "Enter users name you wanna find in DB",
                        type: 'input',
                      },
                ])

                // Перебираємо масив з юзерами.
                for(let i=0; i<users.length; i++) {
                    // По умові якщо є таке імя виводимо всіх користувачів.
                    if(users[i].name.toLowerCase() === search.search.toLowerCase()) {
                        console.log(users[i])
                        noResult = false
                    } 
                };

                // Виводимо повідомлення якщо в базі не має такого імені.
                if(noResult) {
                    console.log('indicate that such a user does not exist.')
                }
                
            } else {
                return
            }

        } else {
            // підсказка для gender.
            gender = await inquirer.prompt([
                {
                    name: "gender",
                    message: "Coose your Gender:",
                    choices:[
                        'male', 
                        'female'
                    ],
                    type: 'list'
                },
            ])

            // підсказка для age.
            age = await inquirer.prompt([
                {
                    name: "age",
                    message: "Enter your age:",
                    type: 'input',
                },
            ])

            // console.log({...name, ...gender, ...age})

            await users.push({...name, ...gender, ...age})
        
            // Зберігаємо в базу данних.
            fs.writeFileSync('users.txt', JSON.stringify(users));
            // Повторуємо цикл по додаваню юзера.
            generationUsers()
        }
    }
}

generationUsers();

