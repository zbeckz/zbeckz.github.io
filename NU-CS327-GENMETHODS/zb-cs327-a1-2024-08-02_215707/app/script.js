// Loops through the photos of halloween
function ChangePhoto()
{
    let obj = document.getElementById("HalloweenImage"); // <img> element    
    let name = obj.src.substring(72, 73);
    console.log(obj.src)
    console.log(name)
    let num = parseInt(name);
    let newNum;

    // get number of next photo
    if (num == 9)
    {
        newNum = 0;
    }
    else
    {
        newNum = num + 1;
    }


    // put filepath of new photo in src
    obj.src = obj.src.substring(0, 72) + newNum + obj.src.substring(73);
}