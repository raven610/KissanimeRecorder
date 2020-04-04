let response = ""
function hint(type,message){
    const div = document.createElement('div')
    div.setAttribute('class',"alert alert-"+type)
    div.setAttribute('role',"alert")
    div.innerHTML=message
    document.querySelector('.alerts').appendChild(div)
    setTimeout(()=>{div.remove()},2000)
}

window.onload = ()=>{
    fetch("/mylist")
    .then(res=>res.json())
    .then(res=>{
        response = res
        for(let i = 0;i<res.length;i++){
            const tr = document.createElement('tr')
            const title = document.createElement('td')
            title.innerHTML = res[i].title
            const watched = document.createElement('td')
            watched.setAttribute("id","watched")
            const span = document.createElement('span')
            span.setAttribute('id','episode'+i)
            span.innerHTML = res[i].watched
            const plus = document.createElement('i')
            plus.setAttribute("class","fas fa-plus")
            plus.setAttribute("onclick","change('plus',"+i+")")
            const minus = document.createElement('i')
            minus.setAttribute("class","fas fa-minus")
            minus.setAttribute("onclick","change('minus',"+i+")")
            watched.appendChild(minus)
            watched.appendChild(span)
            watched.appendChild(plus)
            const episodes = document.createElement('td')
            episodes.innerHTML = res[i].episodes
            const status = document.createElement('td')
            status.innerHTML = res[i].status
            tr.appendChild(title)
            tr.appendChild(watched)
            tr.appendChild(episodes)
            tr.appendChild(status)
            document.querySelector('tbody').appendChild(tr)
        }
    })
    .catch(err=>{hint("warning","list load error");console.log(err)})
}

function change(state,pos){
    let episodes = Number(response[pos].episodes)
    let watched = Number(response[pos].watched)
    if(state === 'plus'){
        if(watched < episodes){
            response[pos].watched = watched+1
            document.querySelector("#episode"+pos).innerHTML  = watched+1
        }
    }else if(state === 'minus'){
        if(watched>1){
            response[pos].watched = watched-1
            document.querySelector("#episode"+pos).innerHTML  = watched-1
        }
    }
}

function save(){
    fetch("/updateWatched",{
        method:'post',
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        },
        body:JSON.stringify(response)
    })
    hint('success','Saved Succesfully')
}

function update(){
    fetch("/updateList")
    .then(res=>res.json())
    .then(res=>{
        if(res.status == "true"){
            location.reload()
            hint('success','Updated Succesfully')
        }else{
            if(res.status == "false"){
                hint('warning','Error while updating list')
            }else{
                hint('warning','Server Connectivity Error')
            }
        }
    })
    .catch(err=>hint('warning','Error while updating list'))
}


