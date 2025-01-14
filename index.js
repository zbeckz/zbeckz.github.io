async function getProjectInfo()
{
    // first, load project info csv data
    try 
    {
        // use built-in js fetch to grab csv data
        const projectData = await fetch('data/project-info.csv');

        // convert the response object to a text string
        const textString = await projectData.text();

        // use split the string into an array where each element is a row of the csv
        const csvRows = textString.split('\r\n');

        // alternatively, could use .then() like below. But above way looks more readable with comments
        /* 
            const projectData = await fetch('data/project-info.csv')
              .then(responseObject => responseObject.text())
              .then(textString => textString.split('\r\n'));
        */

        console.log(csvRows);
    } 
    catch (error)
    {

    }
};

getProjectInfo();