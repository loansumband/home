let str = "OANSUM"
let letter = document.createElement("img")
let dir = "gifs\\ALPHABET\\3DFONT\\"
dir = "images\\"
letter.src = dir + "54\\CAP2\\L.GIF"
letter.width = 200
document.getElementById("title").appendChild(letter)
for(let l of str){
	let num = Math.floor(Math.random() * 73)
	num = 55
    letter = document.createElement("img")
	letter.src = dir +num+"\\LOW2\\"+l+".GIF"
    letter.width = 100
	document.getElementById("title").appendChild(letter)
}


Array.from(document.getElementsByClassName("movable")).forEach(img => {
	img.style.position = "absolute"; // ensure absolute positioning
	img.draggable = false
  
	let isDragging = false;
	let mousestartX = 0;
	let mousestartY = 0;
	let currnode;
  
	document.addEventListener("mousedown", (e) => {
	  isDragging = true;
	//   const rect = img.getBoundingClientRect();
	  mousestartX = e.clientX;
	  mousestartY = e.clientY;
	  currnode = e.target
	  startingX = e.target.style.left.substr(0, currnode.style.top.length - 2)
	  startingY = e.target.style.top.substr(0, currnode.style.top.length - 2)
	  e.target.style.cursor = "grabbing";

	});
	document.addEventListener("mousemove", (e)=>{
		if(isDragging == false || !currnode.isEqualNode(e.target)){
			return
		}
		e = e || window.event;
		e.preventDefault();
		elmnt = currnode
		// calculate the new cursor position:
		pos3 = e.clientX;
		pos4 = e.clientY;
		
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		
		left = parseInt(startingX) + e.clientX - mousestartX
		offtop = parseInt(startingY) + e.clientY - mousestartY


		// set the element's new position:
		elmnt.style.top = offtop + "px";
		elmnt.style.left = left + "px";

	})
	document.addEventListener("mouseup", (e)=>{
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
		e.target.style.cursor = "grab"
		isDragging = false
	})
  
  });