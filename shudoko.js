
var board=[ 
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]

]
time =0;

var numToAdd;
window.onload=function(){
    makeBoard();
    funcId("newboard").addEventListener("click",makeBoard);
    for(let i=0;i<=9;i++){
        funcId("numbers").children[i].addEventListener("click",function(){
            if(this.classList.contains("selected")){
                this.classList.remove("selected");
                numToAdd=undefined;
            }
            else{
                for(let i=0;i<10;i++){
                    funcId("numbers").children[i].classList.remove("selected");

                }
                this.classList.add("selected");
                numToAdd=funcId("numbers").children[i].innerHTML;
            }
        });
    }

}
function makeBoard(){
    emptyBoard();
    let id=0;
    for(let i=0;i<81;i++){
        const idnum=String(i);
        let square=document.createElement("p");
        square.textContent='';
        square.classList.add("square");
        square.id=idnum;
        if(i>=0 && i<9){square.classList.add("borderUp")};
        if(i>=72 && i<=81){square.classList.add("borderBottom")};
        if((i+1) % 9==0){square.classList.add("borderRight")};
        if(i % 9==0){square.classList.add("borderLeft")};
        if((id>17 && id<27) || (id>44 && id<54)){square.classList.add("borderBottom")};
        if(((id+1)%9==3) || ((id+1)%9==6)){square.classList.add("borderRight")};
        id++;
        funcId("board").appendChild(square);

        funcId("board").children[i].addEventListener("click",async function(){
            const numid=parseInt(funcId("board").children[i].id)+1;
            if(numid% 9!=0){
                index1=Math.floor(numid/9);
                index2=numid%9 -1;
            }
            else{
                index2=8;
                index1=Math.floor((numid-1)/9);
            }
            var finalIndexes=[index1,index2];
            if(funcId("board").children[i].innerHTML !='' && numToAdd=='del'){
                funcId("board").children[i].innerHTML ='';
                funcId("board").children[i].classList.remove("solveColor");
                board[index1][index2]=0;

            }
            if(checkDuplicates(board,parseInt(numToAdd),finalIndexes)==true && numToAdd!=undefined && numToAdd!='del'){
                funcId("board").children[i].innerHTML=numToAdd;
                funcId("board").children[i].classList.add("solveColor");
                board[index1][index2]=parseInt(numToAdd);

            }
            // if(checkDuplicates(board,parseInt(numToAdd),finalIndexes)==false && isSolved==false){
            //     funcId("warning1").classList.remove("warn1anim")
            //     funcId("warning2").classList.remove("warn2anim")
            //     funcId("warning3").classList.remove("warn3anim")
            //     await sleep1();
            //     if(fault1==1){funcId("warning1").classList.add('warn1anim');fault1=0}
            //     if(fault2==1){funcId("warning2").classList.add('warn2anim');fault2=0}
            //     if(fault3==1){funcId("warning3").classList.add('warn3anim');fault3=0}

            // }
            funcId("solver").addEventListener("click",function(){
                time=25;
                console.log(time);
                solve1();
            });
            funcId("speedUp").addEventListener("click",function(){
                time=0;
                console.log(time);
                solve1();
            });
            
        })

    }  
}
//************************************************************************************* */
function sleep(){
    return new Promise(resolve=>setTimeout(resolve,time));
}
/**************************************************************************************** */
async function solve1(){
    var empty=findEmptySpace()
    if(!empty){
        isSolved=true;
        return true;
    }
    for(let i=1;i<10;i++){
        if(checkDuplicates(board,i,empty)){
            board[empty[0]][empty[1]]=i;
            finalInd=(empty[0]*9)+empty[1];
            funcId("board").children[finalInd].classList.remove("solveColor");
            await sleep();
            funcId("board").children[finalInd].classList.add("solveColor");
            funcId("board").children[finalInd].innerHTML=i;
            if(await solve1()){
                return true;

            }
            board[empty[0]][empty[1]]=0;
           
        }
    }
    funcId("board").children[0].innerHTML=board[0][0];
   
    return false;

}
/************************************************************************ */
function findEmptySpace(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(board[i][j]==0){
                return [i,j];
            }
        }

    }
}
/**************************************************************************** */
function funcId(id){
    return document.getElementById(id);
}
/******************************************************************************* */
var index1;
var index2;
var fault1;
var fault2;
var fault3;
var isSolved=false;

function emptyBoard(){
    let squares=document.querySelectorAll(".square");
    for(let i=0;i<squares.length;i++){//dout---------------------
        squares[i].remove();
    }
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            squares[i]=0;
        }
    }
    fault1=0
    fault2=0
    fault3=0
    isSolved=false;

}
function checkDuplicates(board,num,empty){    //-------dout--------------------------------
       for(let i=0;i<9;i++){
        if(board[empty[0]][i]==num && empty[1]!=i){
            fault1=1;
            return false;
        }
       }
       for(let i=0;i<9;i++){
        if(board[i][empty[1]]==num && empty[0]!=i){
            fault2=1;
            return false;
        }
       }
       var x=Math.floor(empty[1]/3);
       var y=Math.floor(empty[0]/3);
       for(let i=y*3;i<(y*3)+3;i++){
        for(let j=x*3;j<(x*3)+3;j++){
            if(board[i][j]==num && i!=empty[0] && j!=empty[1]){
                fault3=1;
                return false;
            }
        }
       }
       return true;
}
