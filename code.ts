// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).


function createText(data:string, x:number, y:number) {
  const text = figma.createText();
  text.characters = JSON.stringify(data);
  text.x = x;
  text.y = y;
  text.fontSize = 50;
  text.textAlignHorizontal = "CENTER";
  text.textAlignVertical = "CENTER";
  figma.currentPage.appendChild(text);
  figma.currentPage.selection = [text];
  figma.viewport.scrollAndZoomIntoView([text]);
}

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many rectangles on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = async msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-shapes') {
      const nodes: SceneNode[] = [];
      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }

    if (msg.type === 'file-contents') {
      const text = figma.createText();
      await figma.loadFontAsync(text.fontName as FontName);
      // text.characters = "Hello world!";
      figma.currentPage.appendChild(text);
      figma.currentPage.selection = [text];
      figma.viewport.scrollAndZoomIntoView([text]);

      try {
        const data = JSON.parse(msg.content); // 解析JSON数据
        createBlock(data.page);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        figma.notify(JSON.stringify(e));
      }
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };

  function createBlock(blockData: any) : GroupNode | null {
    if (blockData.type) {
        const rect = figma.createRectangle();
        // const textNode = figma.createText();

        const [x1, y1, x2, y2] = blockData.bbox;
        const width = x2 - x1;
        const height = y2 - y1;

        rect.resize(width, height);
        rect.x = x1;
        rect.y = y1;

        let node_color = getRandomColor();
        if(blockData.type === "mainPage"){
          node_color = {r: 0.9, g: 0.9, b: 0.9};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "header"){
          node_color = {r: 0.5, g: 0.5, b: 0.5};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "card"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "bordedCard"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [];
          rect.strokes = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
          rect.strokeWeight = 5;
        }
        else if(blockData.type === "dropdown"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
          rect.strokeWeight = 5;
        }
        else if(blockData.type === "search"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "button"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "navigationBar" || blockData.type === "block"){
          rect.fills = [];
          rect.strokes = [];
        }
        else if(blockData.type === "annogram"){
          rect.fills = [];
          rect.strokes = [];
        }
        else if(blockData.type === "rightSider"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "tabs"){
          node_color = {r: 0.6, g: 0.6, b: 0.6};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "list"){
          node_color = {r: 1, g: 1, b: 1};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else if(blockData.type === "img"){
          node_color = {r: 0.6, g: 0.6, b: 0.6};
          rect.fills = [{ type: 'SOLID', color: node_color }];
          rect.strokes = [];
        }
        else{
          rect.fills = [];
          rect.strokes = [];
          // rect.strokes = [{ type: 'SOLID', color: node_color }];
          // rect.strokeWeight = 5;
        }
        // figma.currentPage.appendChild(rect);

        if(blockData.content && blockData.content !== ""){
          const text = figma.createText();
          text.characters = JSON.parse(JSON.stringify(blockData.content));
          if(blockData.type === "card" || blockData.type === "list"){
            text.x = x1 + 30;
            text.y = y1 + 50;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
            text.textAlignHorizontal = "LEFT";
            text.textAlignVertical = "CENTER";
          }
          else if (blockData.type === "header"){
            text.x = x1 + 100;
            text.y = y1 + height/2;
            text.fontSize = 100;
            text.fills = [{ type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
            text.textAlignHorizontal = "LEFT";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "bordedCard"){
            text.x = x1 + 20;
            text.y = y1 + 30;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
            text.textAlignHorizontal = "LEFT";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "dropdown"){
            text.x = x1 + 30;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
            text.textAlignHorizontal = "LEFT";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "search"){
            text.characters = "请输入";
            text.x = x1 + 30;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
            text.textAlignHorizontal = "LEFT";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "button"){
            text.x = x1 + width/2;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0.6, g: 0.6, b: 0.6}}];
            text.textAlignHorizontal = "CENTER";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "navigationBar" || blockData.type === "tabs"){
            text.x = x1 + width/2;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
            text.textAlignHorizontal = "CENTER";
            text.textAlignVertical = "CENTER";
          }
          else if(blockData.type === "block" || blockData.type === "annogram" || blockData.type === "rightSider" || blockData.type === "img" || blockData.type === "业务自定义图表"){
            text.x = x1 + width/2;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [];
            text.textAlignHorizontal = "CENTER";
            text.textAlignVertical = "CENTER";
          }
          else{
            text.x = x1 + width/2;
            text.y = y1 + height/2;
            text.fontSize = 50;
            text.fills = [{ type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
            text.textAlignHorizontal = "CENTER";
            text.textAlignVertical = "CENTER";
          }
          
          let group = figma.group([rect, text], figma.currentPage);
          group.x = x1;
          group.y = y1;
          group.name = JSON.parse(JSON.stringify(blockData.content));

          if (blockData.child && blockData.child.length > 0) {
            blockData.child.forEach((childData: any) => {
                const childGroup = createBlock(childData);
                if(childGroup){
                  group.appendChild(childGroup);
                }
            });
          }

          return group;
        }
        else{
          let group = figma.group([rect], figma.currentPage);
          group.x = x1;
          group.y = y1;
          group.name = JSON.parse(JSON.stringify(blockData.type));

          if (blockData.child && blockData.child.length > 0) {
            blockData.child.forEach((childData: any) => {
                const childGroup = createBlock(childData);
                if(childGroup){
                  group.appendChild(childGroup);
                }
            });
          }

          return group;
        }
    }

    return null;
  }


  function getRandomColor() {
    return {
      r: Math.random(),
      g: Math.random(),
      b: Math.random()
    };
  }

}