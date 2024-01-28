'use client'
import { useState,useEffect } from "react";
export default function Home() {
  const [websiteSections, setWebsiteSections] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingImage, setEditingImage] = useState('');

  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem('websiteSections')) || [];
    setWebsiteSections(savedSections);
  }, []);

  useEffect(() => {
    localStorage.setItem('websiteSections', JSON.stringify(websiteSections));
  }, [websiteSections]);

  const handleToolDragStart = (tool) => {
    setCurrentTool(tool);
  };

  const handleSectionDrop = (event) => {
    event.preventDefault();

    if (currentTool) {
      const { clientX, clientY } = event;
      const { left, top } = event.currentTarget.getBoundingClientRect();
      const offsetX = clientX - left;
      const offsetY = clientY - top;

      const newSection = {
        type: currentTool,
        position: {
          x: offsetX,
          y: offsetY,
        },
        text: '',
        image: '',
        editing:true
      };
    
      setWebsiteSections([...websiteSections, newSection]);
      setCurrentTool(null);
    }
  };

  const handleTextSubmit = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing = false;
    setWebsiteSections(updatedSections);
  };
  const handleImageChange = (index, newImage) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing = true;
    
    updatedSections[index].image = newImage;
    setWebsiteSections(updatedSections);
  };

const handleTextChange = (index, newText) => {
  const updatedSections = [...websiteSections];
  updatedSections[index].text = newText;
  setWebsiteSections(updatedSections);
};
  const handleSectionDelete = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections.splice(index, 1);
    setWebsiteSections(updatedSections);
  };
  const handleTextEdit = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing =true;
    setWebsiteSections(updatedSections);
  };
  const handleSaveButtonClick = () => {
    console.log('Saved Website Sections:', websiteSections); //Please See Console 
  };
 
  const handleDragStart = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing = true;
    setWebsiteSections(updatedSections);
  };
  const handleImageSubmit = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing = false;
    
    updatedSections[index].showImage = true;
    setWebsiteSections(updatedSections);
  };
  const handleImageEdit = (index) => {
    const updatedSections = [...websiteSections];
    updatedSections[index].editing = true;    updatedSections[index].showImage = false;

    setWebsiteSections(updatedSections);
  };
  return (
    <div className="flex">
    <div className="w-[20%] h-[100vh] flex justify-center items-center flex-col bg-blue-600 p-4">
      <p className="font-bold text-6xl relative bottom-4">ToolBar</p>
      <div
        draggable
        onDragStart={() => handleToolDragStart('text')}
        className="font-semibold text-2xl font-serif bg-blue-500 text-center text-white p-2 w-40 cursor-pointer mt-2"
        style={{borderRadius:"5px"}}   >
        Text
      </div>
      <div
        draggable
        onDragStart={() => handleToolDragStart('image')}
        className="font-semibold text-2xl font-serif bg-green-500 text-center text-white w-40 p-2 cursor-pointer mt-3"
        style={{borderRadius:"5px",border:"solid green 2px"}}    >
        Image
      </div>
    </div>
    <div
      onDrop={handleSectionDrop}
      onDragOver={(event) => event.preventDefault()}
      className="w-[80%] h-[100vh] bg-white p-4 relative"
    >
      {websiteSections.map((section, index) => (
       <div
       key={index}
       className="absolute"
       style={{ left: section.position.x, top: section.position.y }}
       draggable={true} // Make the text section draggable, but not the image
       onDragStart={() => handleDragStart(index)} >
         {section.type === 'text' && (
            <div>
              <input
                type="text"
                value={section.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder="Enter text"
                className="text-black"
                autoFocus={section.editing} // Autofocus when in editing mode
                onBlur={() => {
                  if (section.showSubmitButton) {
                    handleTextSubmit(index);
                  }
                }}
                disabled={!section.editing}
              />
              {section.editing ? (
                <>
                  <button
                    onClick={() => handleTextSubmit(index)}
                    className="ml-3 bg-green-500 p-1 text-white font-bold font-serif pl-1"
                    style={{borderRadius:"5px"}}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleTextEdit(index)}
                  className="mt-2 p-2 bg-blue-500 text-white font-bold font-serif pl-1"
                  style={{borderRadius:"5px"}}    >
                  Edit
                </button>
              )}
            </div>
          )}
 {section.type === 'image' && (
            <>
              {!section.showImage && (
                <div>
                  <input
                    type="text"
                    value={section.image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="text-black"
                    autoFocus={section.editing}
                    disabled={!section.editing} // Disable the input when not in editing mode
                  />
                  {section.editing && (
                    <button
                      onClick={() => handleImageSubmit(index)}
                      className="ml-2 p-1 bg-green-500 text-white  font-bold font-serif pl-1"
                     style={{borderRadius:"5px"}}>
                      Submit
                    </button>
                  )}
                </div>
              )}
              {section.showImage && (
                <>
                  <img
                    draggable={true}
                    src={section.image}
                    alt={`Section ${index}`}
                    className="mt-2 max-w-full max-h-64"
                  />
                  {section.editing ? (
                    <>
                      <button
                        onClick={() => handleImageSubmit(index)}
                        className="mr-2 p-1 bg-green-500 text-white  font-bold font-serif pl-1"
                        style={{borderRadius:"5px"}}  >
                        Submit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleImageEdit(index)}
                      className="mr-2 p-1 bg-blue-500 font-bold font-serif pl-1 text-white"
                      style={{borderRadius:"5px"}}    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </>
          )}
          <button
            onClick={() => handleSectionDelete(index)}
            className="mt-2 p-[2px] bg-red-500 font-bold font-serif pl-1 text-white"
            style={{ borderRadius: '5px' }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
    <div className="w-100 p-4">
      <button onClick={handleSaveButtonClick} className="bg-blue-500 text-white p-2">
        Save
      </button>
    </div>
  </div>
  );
}
