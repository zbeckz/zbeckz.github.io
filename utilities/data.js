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
    } 
    catch (error)
    {
        console.log('Error fetching project data:', error)
    }
};

// given a min and max number, returns a random decimal number within that range. [min, max)
function getRandomFloat(min, max)
{
    return Math.random() * (max - min) + min;
}