import './styles.css';


//need to update to allow more than on canvas and gl inst
let canvas, gl;
const containerTrackClassName = 'jcg_container';

//set up listener trigger init only after we are added to the dom
const target = document.getElementsByTagName("body")[0];
const addOptions = {attributes:false, childList:true, subtree:true}
const addCheck = (mutationRecord, observer) => {
    for(const mutation of mutationRecord){
        if (mutation.type === "childList"  || mutation.addedNodes.length < 0){
            //must loop this way
            for(let i = 0  ; i < mutation.addedNodes.length ; i++){
                let node = mutation.addedNodes[i];
                if(node.classList.contains(containerTrackClassName)){
                    //START IT UP
                    addObserver.disconnect();
                    initWebGL(canvas);
                }
            }
        }
    }
}
const addObserver = new MutationObserver(addCheck);
addObserver.observe(target, addOptions);

//container div to hold canvas
function container(){

    const container = document.createElement('div');
    container.classList.add(containerTrackClassName);
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
    return container;
    
}

async function initWebGL(canvas){
    console.log("INIT");
    gl = canvas.getContext('webgl2');
}


document.body.appendChild( container( ) );

