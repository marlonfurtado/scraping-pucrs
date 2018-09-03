# scraping-pucrs
> Scraping PUCRS courses

## What is  
A script application to get the course and [discipline information](dist/) from the PUCRS website.  
  
  
## Why  
Currently PUCRS does not offer an efficient API to access the data of the disciplines and courses.  
So this application aims to scrape data from the university website and make available in JSON files to facilitate the development of any application for the academic community.  
  
  
## How do  
#### Running
``` bash
# install dependencies
npm install

# serve at localhost:3000
npm start
```
#### Routes
- `localhost:3000/:school/:course`  

    http://localhost:3000/politecnica/engenharia-de-software  
    > return an array of objects with infos about course schedule  
    ```
    [{
      "school": "politecnica",
      "course": "engenharia-de-software",
      "semester": "1",
      "code": "4115H-04",
      "discipline": "Cálculo A",
      "hours": "60"
      }, ...
    ]
    ```


- `localhost:3000/all`  

   http://localhost:3000/all  
   Create 60 json files with infos about all courses in */dist* folder   
   Acces the files [here](dist/)  

## Easy way :octocat:  
Use git submodules.  

Examples:  
https://blog.github.com/2016-02-01-working-with-submodules/  
https://git-scm.com/docs/git-submodule  
