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

// const pubUrl =
//   "https://docs.google.com/document/d/e/2PACX-1vQAVUO6JaJ1uQaLUFDXzOyivSkwG6Xido0OtQlRr79F3Btpn8keR-DBU5W-aDui-6f0lbd4JLmu4AdO/pub";

// const proxies = [
//   url => "https://api.allorigins.win/raw?url=" + encodeURIComponent(url),
//   url => "https://corsproxy.io/?" + encodeURIComponent(url)
// ];

// const eventsDiv = document.querySelector(".events");
// const statusDiv = document.querySelector(".status");

// let lastContent = "";
// let isLoading = false;

// async function fetchDoc() {

//   // Prevent overlapping requests
//   if (isLoading) return;

//   isLoading = true;

//   for (const proxy of proxies) {

//     try {

//       const response = await fetch(proxy(pubUrl), {
//         cache: "no-store"
//       });

//       if (!response.ok) {
//         throw new Error("Bad response");
//       }

//       const html = await response.text();

//       const parser = new DOMParser();
//       const doc = parser.parseFromString(html, "text/html");

//       const content =
//         doc.querySelector(".doc-content") ||
//         doc.body;

//       const newHtml = content.innerHTML;

//       // Only update if changed
//       if (newHtml !== lastContent) {

//         eventsDiv.innerHTML = newHtml;
//         lastContent = newHtml;

//         console.log("Updated:", new Date().toLocaleTimeString());
//       }

//       statusDiv.textContent =
//         "Last checked: " +
//         new Date().toLocaleTimeString();

//       isLoading = false;
//       return;

//     } catch (err) {

//       console.warn("Proxy failed:", err);
//     }
//   }

//   statusDiv.textContent =
//     "Update failed: " +
//     new Date().toLocaleTimeString();

//   isLoading = false;
// }

// // Initial load
// fetchDoc();

// // Refresh every 2 seconds
// setInterval(fetchDoc, 2000);