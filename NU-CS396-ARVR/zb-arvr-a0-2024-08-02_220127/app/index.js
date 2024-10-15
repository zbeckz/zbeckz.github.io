// Loops through the photos of gus :)
function ChangeGusPhoto()
{
    let obj = document.getElementById("GusImage"); // <img> element    
    let name = obj.src.substring(66, 67)
    let num = parseInt(name);
    let newNum;

    // get number of next photo
    if (num == 6)
    {
        newNum = 0;
    }
    else
    {
        newNum = num + 1;
    }


    // put filepath of new photo in src
    obj.src = obj.src.substring(0, 66) + newNum + obj.src.substring(67);
}

function NoAssignment()
{
    window.alert("Assignment not created yet! Please come back later and try again :)")
}