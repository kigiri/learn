const scrollBar = { size: 16 }

// Add a div to find the scroll bar width
var scrollBox = document.createElement('div');
scrollBox.style.visibility = "hidden";
scrollBox.style.overflowX = "scroll";
document.body.appendChild(scrollBox);
scrollBar.size = scrollBox.getBoundingClientRect().height;
document.body.removeChild(scrollBox);

console.log("Scroll bar size:", size);

export default scrollBar;
