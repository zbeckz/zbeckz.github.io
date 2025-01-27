// Fetches data from a json file and formats it for usage on the page
async function getProjectInfo()
{
    try 
    {
        // use built-in js fetch to grab json data
        const data = await fetch('data/project-info.json');

        // process data
        const json = await data.json();

        // format it as array, save in global var
        projectData = Object.entries(json).map(([key, value]) => {
            return {
                title: key,
                url: value.url,
                previewImg: value.previewImg
            };
        });

        setInterval(() => {
            currentProjectPreview === projectData.length - 1 ? currentProjectPreview = -1 : currentProjectPreview++;
            const imgElement = document.getElementById('projectsImage');
            imgElement.style.opacity = '0%';
            
            setTimeout(() => {
                imgElement.src = currentProjectPreview === -1 ? 'assets/code-snippet.png' : projectData[currentProjectPreview].previewImg;
                imgElement.style.opacity = '100%';
            }, 1000);
        }, 10000)
    } 
    catch (error)
    {
        console.log('Error fetching project data:', error)
    }
};