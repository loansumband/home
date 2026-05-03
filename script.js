// let str = "OANSUM"
// let letter = document.createElement("img")
// let dir = "gifs\\ALPHABET\\3DFONT\\"
// dir = "images\\"
// letter.src = dir + "54\\CAP2\\L.GIF"
// letter.width = 200
// document.getElementById("title").appendChild(letter)
// for(let l of str){
// 	let num = Math.floor(Math.random() * 73)
// 	num = 55
//     letter = document.createElement("img")
// 	letter.src = dir +num+"\\LOW2\\"+l+".GIF"
//     letter.width = 100
// 	document.getElementById("title").appendChild(letter)
// }


Array.from(document.getElementsByClassName("movable")).forEach(img => {
	img.style.position = "absolute"; // ensure absolute positioning
	img.draggable = false
  
	let isDragging = false;
	let mousestartX = 0;
	let mousestartY = 0;
	let currnode;

	function getClientX(e) {
		return e.touches ? e.touches[0].clientX : e.clientX;
	}
	
	function getClientY(e) {
		return e.touches ? e.touches[0].clientY : e.clientY;
	}
	
	document.addEventListener("mousedown", startDrag);
	document.addEventListener("touchstart", startDrag);
	
	document.addEventListener("mousemove", drag);
	document.addEventListener("touchmove", drag);
	
	document.addEventListener("mouseup", endDrag);
	document.addEventListener("touchend", endDrag);
	
	function startDrag(e) {
		isDragging = true;
		
		mousestartX = getClientX(e);
		mousestartY = getClientY(e);
		
		currnode = e.target;
		
		startingX = parseInt(currnode.style.left) || 0;
		startingY = parseInt(currnode.style.top) || 0;
		
		currnode.style.cursor = "grabbing";
	}
	
	function drag(e) {
		if (!isDragging || !currnode) return;

		e.preventDefault();

		let clientX = getClientX(e);
		let clientY = getClientY(e);

		let left = startingX + (clientX - mousestartX);
		let top = startingY + (clientY - mousestartY);

		currnode.style.left = left + "px";
		currnode.style.top = top + "px";
	}
	
	function endDrag(e) {
		isDragging = false;
		if (currnode) currnode.style.cursor = "grab";
	}
  
  });