// Fetches data from a csv file and formats it for usage on the page
async function getProjectInfo()
{
    // first, load project info csv data
    try 
    {
        // use built-in js fetch to grab csv data
        const data = await fetch('data/project-info.csv');
        console.log(data);

        // convert the response object to a text string
        const textString = await data.text();
        console.log(textString);

        // use split to split the string into an array where each element is a row of the csv
        const csvRows = textString.split('\r\n');
        console.log(csvRows);

        // use split to map each element into an object with named attributes. Save that to project data global var
        projectData = csvRows.map(row => {
            const rowSplit = row.split('\t');
            return {
                title: rowSplit[0],
                url: rowSplit[1],
                previewImg: rowSplit[2]
            }
        });
        console.log(projectData)

        setInterval(() => {
            currentProjectPreview === projectData.length - 1 ? currentProjectPreview = -1 : currentProjectPreview++;
            const imgElement = document.getElementById('projectsImage');
            imgElement.style.opacity = '0%';
            
            setTimeout(() => {
                imgElement.src = currentProjectPreview === -1 ? 'assets/code-snippet.png' : projectData[currentProjectPreview].previewImg;
                imgElement.style.opacity = '100%';
            }, 1000);
        }, 10000)

        // alternatively, could use .then() like below. But above way looks more readable with comments
        /* 
            const projectData = await fetch('data/project-info.csv')
              .then(responseObject => responseObject.text())
              .then(textString => textString.split('\r\n'));
        */
    } 
    catch (error)
    {
        console.log('Error fetching project data:', error)
    }
};