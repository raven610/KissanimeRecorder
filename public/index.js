let anime = ""

function hint(type,message){
    const div = document.createElement('div')
    div.setAttribute('class',"alert alert-"+type)
    div.setAttribute('role',"alert")
    div.innerHTML=message
    document.querySelector('.alerts').appendChild(div)
    setTimeout(()=>{div.remove()},2000)
}


function generate(){
    const url = document.querySelector('#url').value
    fetch("/getDetails",{
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({"url":url})
    }).then(res=>res.json())
    .then(res=>{
        anime = res
        document.querySelector("#anime-title").value = res.title
        document.querySelector("#episodes-total").value = res.episodes
    }).catch((err)=>hint('warning',"Server Error!"))
}


function send(){
    try{
        let watched = Number(document.querySelector('#episodes-watched').value)
        let total = Number(document.getElementById('episodes-total').value)
        if(watched <= total && total!== 0 && watched !== 0){
            anime.watched = watched
            anime.url = document.querySelector("#url").value
            fetch("/add",{
                method:'post',
                headers:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body:JSON.stringify(anime)
            }).then(res=>res.json())
            .then(res=>{
                console.log(res)
                if(res.inserted ==="true"){
                    hint('success','Submitted')
                    clearFields()
                }else if(res.inserted ==="false"){
                    hint('warning','Anime Already In List')
                    clearFields()
                }
            }).catch(err=>hint('warning',"Error While Adding to list"))
            
        }else{
            hint('warning','Watched Episodes are Incorrect/Empty')
        }
    }catch{
        hint('warning','Error')
    }
}
function clearFields(){
    document.querySelector('#episodes-watched').value=""
    document.getElementById('episodes-total').value=""
    document.querySelector('#anime-title').value=""
    document.querySelector('#url').value =""
}