import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'angular-storybook-author';
  public pageNumber = 0;
  // Hold raw image data.
  public images = [];
  private blankTitlePage = {
    pageNumber: 0,
    image: null,
    text: "",
    audio: null,
    sceneObjects: [],
    prompts: []
  };

  // Store information for each page.
  public pages = [this.blankTitlePage];

  // Store target words for the story.
  public targetWords = [];

  // Get an empty template for a rectangle object.
  public latestRectangle = {
    rectangle: {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    }
  };

  // Can show and hide scene object boxes and labels to declutter the page.
  // Is an object not just a bool so that the drawing directive can use it.
  public sceneObjectsHidden = { hidden: false };
  public inputText: string = '';

  // Variables for scaling rectangles as the image scales.
  private widthScale = 0;
  private heightScale = 0;
  // Current height of the image that was uploaded
  private imageWidth;
  private imageHeight;
  // Initial height of the image that was uploaded
  private initialWidth;
  private initialHeight;


  //////////////////////
  // Audio Record
  //////////////////////
  private audioContext;
  private audioStream;
  private audioRecorder;
  public isRecording = false;
  private startRecordTime;
  private wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  constructor() {
    // Initialize.
    this.initRecorder();

    // TODO: what is this?
    // this.$watch('file', function(newfile, oldfile) {
    //     if(angular.equals(newfile, oldfile) ){
    //         return;
    //     }
    // });

    //TODO
    // Key bindings for navigation of pages.
    // document.onkeyup(e: any => {
    //     if (document.activeElement === document.body) {
    //         this.$apply(function() {
    //             if (e.which == 37 || e.which == 38) {
    //                 // Left or up.
    //                 this.prev();
    //             } else if (e.which == 39 || e.which == 40) {
    //                 // Right or down.
    //                 this.next();
    //             } else {
    //                 // Nothing.
    //             }
    //         });
    //     }
    // });

    // Key listener for enter key in the label text box.
    // Upon enter key, save the drawn rectangle and the associated label.
    document.querySelector('body').addEventListener('keyup', ((event: any) => {
      if (event.target.id.toLowerCase() === 'label') {
        if (event.keyCode === 13) {
          // Save the new scene object.
          this.uploadDraw();

          // Remove the label.
          var label = document.getElementById("label");
          document.getElementById("sceneObjectLabelButtonContainer")
            .removeChild(label);
        }
      }
    }));

    // On window resize, need to resize the rectangles and remember the new
    // scaling factor.
    window.addEventListener('resize', () => {
      this.startDraw(false);

      var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("drawnRectCanvas");
      var drawnRectCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");
      var sceneObjects = this.pages[this.pageNumber].sceneObjects;
      // console.log(sceneObjects);
      for (var i = 0; i < sceneObjects.length; i++) {
        var sceneObj = sceneObjects[i];
        // Scale the known initial position by the new scaling factors.
        var sizeX = sceneObj["position"]["width"] * this.widthScale;
        var sizeY = sceneObj["position"]["height"] *  this.heightScale;
        var topLeftY = sceneObj["position"]["top"] *  this.heightScale;
        var topLeftX = sceneObj["position"]["left"] *  this.widthScale;
        drawnRectCanvasContext.strokeRect(topLeftX, topLeftY, sizeX, sizeY);

        // Re-style the label and delete button's positioning.
        var div = document.getElementById(`${i}`);

        console.log("After window resize, changing style of scene object", sceneObj.id);
        div.style.top = (topLeftY - 15) + "px";
        div.style.left = (topLeftX - 10) + "px";
      }
    });

  }

  public controlContainerSize(): any {
      //TODO
      return { width: '1147px', height: '500px' };
  }

  private initRecorder() {
      console.log("initRecorder");
      //TODO
    // this.audioContext = new AudioContext();
    // navigator.getUserMedia({ audio: true }, function(stream) {
    //   this.audioStream = stream;
    //   var input = this.audioContext.createMediaStreamSource(stream);
    //   this.audioRecorder = new Recorder(input);;
    //   console.log("Recorder initialized!");
    // }, function(err) {
    //   console.log(err);
    // });
  }

  startRecord() {
    console.log("startRecord");
    //TODO
    // this.audioRecorder.clear();
    // this.wait(250).then(() => {
    //   this.audioRecorder.record();
    //   this.startRecordTime = new Date();
    //   // this.$apply(function() {
    //   this.isRecording = true;
    //   // });
    // });
  }

  endRecord() {
    console.log("endRecord");
    this.audioRecorder.stop();
    var durationSeconds = (new Date().getTime() - this.startRecordTime) / 1000.0;
    this.isRecording = false;
    console.log("duration: ", durationSeconds);
    // Save wav file.
    this.audioRecorder.exportWAV(function(blob) {
      var audioFileName = "audio_chunk_" + this.formatDate(new Date()) + ".wav";
      this.uploadAudio(blob, audioFileName);
      this.pages[this.pageNumber].audioDuration = durationSeconds;
    });
  }

  // Helper function for creating filenames for recorded audio.
  private formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();


    return day + '-' + monthNames[monthIndex] + '-' + year + '-'
      + hour + ":" + minute + ":" + seconds;
  }

  //////////////////////////
  // Content Uploading
  //////////////////////////



  // To be called when the user clicks submit.
  // Gathers all the pages, creates scene objects, saves book in the database.
  public submitStory() {
    // The create function posts all books.
    //TODO
    // Books.create(this.pages, this.targetWords)
    //   .success(function(data) {
    //     // TODO: add some sort of confirmation that the story
    //     // was successfully submitted.
    //     console.log("Story submitted successfully!");
    //   });
  };

  private uploadAudio(blob, audioFileName) {
    var uploadUrl = "/audioUpload";
    var fd = new FormData();
    fd.append("audio", blob, audioFileName);
    fetch(uploadUrl, {
      method: "post",
      body: fd
    }).then(function(res) {
      return res.text();
    }).then(
      function(text) {
        console.log("Server received file: ", text);
        if (text != audioFileName) {
          throw new Error(`Audio file name mismatch, expecting ${audioFileName}, got ${text}`);
        }
        this.$apply(function() {
          this.pages[this.pageNumber].audio = text;
        });
      }, function(err) {
        console.log(err);
      }
    );
  }

  public uploadImageClick() {
    document.getElementById("uploadImageFileInput").click();
  }

  // Trigger the file chooser when the upload button is clicked.
  public uploadAudioClick() {
    document.getElementById("uploadAudioFileInput").click();
  }

  // For when the user uploads a file instead of recording their audio.
  public saveAudioFile(files) {
    var file = files[0];
    var audioFileName = file.name;
    this.uploadAudio(file, audioFileName);
  }

  public getAudioFileName() {
    if (this.pages[this.pageNumber].audio != "") {
      var filename = this.pages[this.pageNumber].audio;
      var path = "audio/" + filename;
      return path;
    }
  }

  // Upload image from our view via a post request to the server.
  public uploadImage(files) {
    var paras = document.getElementsByClassName('deleteButton');
    if (paras.length > 0) {
      do {
        paras[0].parentNode.removeChild(paras[0]);
      }
      while (paras[0]);
    }

    var uploadUrl = "/imageUpload";
    var file = files[0];

    var fd = new FormData();
    fd.append("image", file, file.name);
    fetch(uploadUrl, {
      method: "post",
      body: fd
    }).then(function(res) {
      return res.text();
    }).then(
      function(text) {
        console.log("Server received file: ", text);
        if (text != file.name) {
          throw new Error(`Image file name mismatch, expecting ${file.name}, got ${text}`);
        }
      }, function(err) {
        console.log(err);
      }
    );

    // Update page with correct image information.
    this.pages[this.pageNumber].image = file.name;

    // This triggers the callback in this.handleUserSelectedFile() file reader.
    var url = URL.createObjectURL(file);

    let img = new Image();
    img.onload = () => {
      // Set global variables.
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.pages[this.pageNumber].sceneObjects = [];
    };
    img.src = url;

    let imageElement: HTMLImageElement =  <HTMLImageElement> document.getElementById("uploadedImage");
    console.log(imageElement);
    if (imageElement) {
        if (this.pageNumber == 0) {
         imageElement.style.maxWidth = "60%";
        }
        else {
          imageElement.style.maxWidth = "40%";
        }
    }
  };

  // Read current image file and save its contents.
  public handleUserSelectedFile(file) {
    console.log(`handleUserSelectedFile`);
    //TODO
    // if (file.type.startsWith("image")) {
    //   this.progress = 0;
    //   // Called as a callback to the img.onload() in uploadImage().
    //   fileReader.readAsDataUrl(file, this)
    //     .then(function(result) {
    //       // this.imageSrc = result;
    //       this.images[this.pageNumber] = {
    //         imageName: this.pages[this.pageNumber]["image"],
    //         imageFile: result
    //       };
    //     });
    // } else if (file.type.startsWith("audio")) {
    //   console.log("getting audio file");
    // }
  };

  /////////////////////////
  // Title and Story Text
  /////////////////////////

  // Returns placeholder text for the textarea, either for title page
  // or for main page.
  public getPlaceholderText() {
    if (this.pageNumber == 0) {
      return "Enter a story title...";
    } else {
      return "Type to enter page content...";
    }
  }

  // Save the new text for this page from the text box.
  public uploadText(event: any) {
    var trimmedTextArray = this.inputText.split(/(\s+)/).filter(function(s) {
      return /\S/.test(s);
    });
    var trimmedText = trimmedTextArray.join(" ");
    this.pages[this.pageNumber].text = trimmedText;
  };

  public onKey(event: any) { // without type info
    console.log(`onKey`, this.inputText, event);
  }

  ///////////////////////////////////
  // Target Words
  ///////////////////////////////////


  public addTargetWordButtonClick() {
    var newTargetWord = {
      "word": ""
    };
    this.targetWords.push(newTargetWord);
  };

  public uploadTargetWord(index) {
    var targetWordsById = document.getElementById("titlePageTargetWords");
    var targetWordsByClass = targetWordsById.getElementsByClassName("targetWordTextArea");
    var element: any =  targetWordsByClass[index];
    this.targetWords[index].word = element.value;
  }

  public deleteTargetWord(index) {
    this.targetWords.splice(index, 1);
  }


  ///////////////////////////////////
  // Adding and Deleting Prompts
  ///////////////////////////////////

  public uploadQuestion(index) {
    // Janky af, try to use ng-model, figure out how to do it with ng-repeat.
    var element: any = document.getElementsByClassName("promptTextContainer")[index]
      .getElementsByClassName("questionTextArea")[0];
    var textContent = element.value;
    this.pages[this.pageNumber].prompts[index].question = textContent;
  };

  public uploadResponse(index) {
    // Same as above, janky af.
    var element: any = document.getElementsByClassName("promptTextContainer")[index]
      .getElementsByClassName("responseTextArea")[0];
    var textContent = element.value;
    this.pages[this.pageNumber].prompts[index].response = textContent;
  };

  public uploadHint(index) {
    // Same as above, janky af.
    var element: any = document.getElementsByClassName("promptTextContainer")[index]
      .getElementsByClassName("hintTextArea")[0];
    var textContent = element.value;
    this.pages[this.pageNumber].prompts[index].hint = textContent;
  };

  public addPromptClick() {
    // Add question to current page.
    var newPrompt = {
      "question": "",
      "response": "",
      "hint": "",
    };
    this.pages[this.pageNumber].prompts.push(newPrompt);
  }

  public deletePromptClick(index) {
    // Remove question at given index on current page.
    this.pages[this.pageNumber].prompts.splice(index, 1);
  }

  ///////////////////////////////////
  // Sidebar Preview Logic
  ///////////////////////////////////

  // Get the thumbnail to display.
  public getPreviewThumbnail(index) {
    if (this.images.length >= index && this.images[index] != undefined) {
      return this.images[index].imageFile;
    } else {
      return "assets/previewBlock.png";
    }
  }

  public getPreviewText(index) {
    return this.pages[index].text;
  }

  // Highlight the border of the thumbnail that represents active page.
  public previewBorderStyle(index) {
    if (index == this.pageNumber) {
      return "1pt solid blue";
    } else {
      return "none";
    }
  }

  // Click handler for when someone clicks on one of the thumbnails
  // in the side bar to navigate there.
  public goToSelectedPage(index) {
    this.goToPage(index);
  }

  //////////////////////////////////
  // Page Navigation Logic
  //////////////////////////////////

  // Whenever we change pages, use this function, otherwise keeping
  // track of the scope variables gets really confusing.
  private goToPage(index) {
    // Note: do this even if the index is the same as current page
    // number, since it might be after a delete, and the pages array
    // could have changed and we want to reflect those changes.
    if (this.pages.length >= index && index >= 0) {
      // Update all of the scope variables!!
      this.pageNumber = index;
      this.inputText = this.pages[this.pageNumber].text || "";
    }
    let imageElement: HTMLImageElement =  <HTMLImageElement> document.getElementById("uploadedImage");
    console.log(imageElement);
    if (imageElement) {
        if (this.pageNumber == 0) {
         imageElement.style.maxWidth = "60%";
        }
        else {
          imageElement.style.maxWidth = "40%";
        }
    }
  }

  // Navigate to the previous page.
  public prev() {
    if (this.pageNumber > 0) {
      this.goToPage(this.pageNumber - 1);
    }
  };

  // Navigate to the next page.
  public next() {
    // If this is the last page, we first need to add a new page.
    if (this.pageNumber == this.pages.length - 1) {
      this.addPageAtIndex(this.pageNumber + 1);
    }
    this.goToPage(this.pageNumber + 1);
  };

  // Click handler for "AddPage" button.
  public addPageAfterCurrent() {
    this.addPageAtIndex(this.pageNumber + 1);
    this.goToPage(this.pageNumber + 1);
  }

  // Helper to insert a new page and make necessary
  // modifications to this.pages and this.images.
  private addPageAtIndex(index) {
    var data = {
      pageNumber: this.pageNumber,
      image: null,
      text: "",
      audio: null,
      sceneObjects: [],
      prompts: []
    };
    //TODO splice??
    let newPages = [];
    // Add previous pages.
    for (var i = 0; i < index; i++) {
      newPages.push(this.pages[i]);
    }
    // Add new page.
    newPages.push(data);
    // Add rest of pages at an offset.
    for (i = index; i < this.pages.length; i++) {
      var p = this.pages[i];
      p.pageNumber++;
      newPages.push(p);
    }
    // Update pages.
    this.pages = newPages;
    // Add empty image at this index.
    this.images.splice(index, 0, null);
    console.log("splicing at index ", index);
  }

  // Click handler for "DeletePage" button.
  public deleteCurrentPage() {
    // Remove from pages and update page numbers.
    //TODO splice??
    let newPages = [];
    for (var i = 0; i < this.pageNumber; i++) {
      newPages.push(this.pages[i]);
    }
    if (this.pageNumber + 1 < this.pages.length) {
      for (var i = this.pageNumber + 1; i < this.pages.length; i++) {
        var p = this.pages[i];
        p.pageNumber++;
        newPages.push(p);
      }
    }

    // Remove from the images array.
    this.images.splice(this.pageNumber, 1);

    // Update current page number.
    if (this.pageNumber == this.pages.length - 1) {
      // It's the last page, so decrement the page number.
      this.goToPage(this.pageNumber - 1);
    } else {
      // It's not the last page, so leave the page number the same.
      this.goToPage(this.pageNumber);
    }

    // Update pages!
    this.pages = newPages;
  }

  // What is displayed as the page number at the bottom of the screen.
  public getPageNumberDisplay() {
    if (this.pageNumber == 0) {
      return "Title Page";
    } else {
      return "Page " + this.pageNumber;
    }
  }


  //////////////////////////////////
  // Building Rectangles
  //////////////////////////////////


  // Getting scale factors for the image with respect to canvas width.
  public startDraw(firstDrawn) {
      var canvas: HTMLCanvasElement = <HTMLCanvasElement>  document.getElementsByClassName("drawing")[0];
      var drawingCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");

      let uploadedImage: HTMLImageElement = <HTMLImageElement> document.getElementById("uploadedImage");
    drawingCanvasContext.canvas.width = uploadedImage.width;
    drawingCanvasContext.canvas.height = uploadedImage.height;

    this.imageWidth = uploadedImage.naturalWidth;
    this.imageHeight = uploadedImage.naturalHeight;
    if (firstDrawn) {
      this.initialWidth = drawingCanvasContext.canvas.width;
      this.initialHeight = drawingCanvasContext.canvas.height;
    }

    this.widthScale = uploadedImage.width / this.imageWidth;
    this.heightScale = uploadedImage.height / this.imageHeight;

    // Setting the drawn rectangles canvas size.
    canvas = <HTMLCanvasElement> document.getElementById("drawnRectCanvas");
    var drawnRectCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");
    drawnRectCanvasContext.canvas.width = drawingCanvasContext.canvas.width;
    drawnRectCanvasContext.canvas.height = drawingCanvasContext.canvas.height;
    this.initialWidth = drawingCanvasContext.canvas.width;
    this.initialHeight = drawingCanvasContext.canvas.height;
    // Also set the size of the parentSceneObject div, so that the
    // labels and the delete buttons will be positioned correctly relative
    // to the parentSceneObject div.
    var containerDiv: any = document.getElementById("sceneObjectLabelButtonContainer");
    containerDiv.width = drawingCanvasContext.canvas.width;
    containerDiv.height = drawingCanvasContext.canvas.height;
  }

  // drawing on the drawn rectangle canvas when entered
  public uploadDraw() {
    let canvas;
    canvas = <HTMLCanvasElement>  document.getElementsByClassName("drawing")[0];
    var drawingCanvasContext = canvas.getContext("2d");
    canvas = <HTMLCanvasElement> document.getElementById("drawnRectCanvas");
    var drawnRectCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");

    function draw(startX, startY, endX, endY) {
      var sizeX = (endX - startX);
      var sizeY = (endY - startY);

      drawnRectCanvasContext.strokeRect(startX, startY, sizeX, sizeY);
      drawingCanvasContext.clearRect(0, 0, drawingCanvasContext.canvas.width, drawingCanvasContext.canvas.height);

      var index = this.pages[this.pageNumber].sceneObjects.length;
      var label = (<any> document.getElementById("label")).value

      var widthRatio = this.imageWidth / this.initialWidth;
      var heightRatio = this.imageHeight / this.initialHeight;
      var sceneObj = {
        "position": {
          "width": sizeX * widthRatio,
          "top": startY * heightRatio,
          "height": sizeY * heightRatio,
          "left": startX * widthRatio
        },
        "id": index,
        "inText": null, // Don't know yet.
        "label": label
      };

      this.$apply(function() {
        this.pages[this.pageNumber].sceneObjects.push(sceneObj);
      });

      // Set the positioning of the delete button and label.
      this.styleSceneObject(index, label);
    }

    // Draw the latest rectangle from the drawing directive onto the
    // canvas that displays all current scene objects.
    var r = this.latestRectangle.rectangle;
    draw(r["startX"], r["startY"], r["endX"], r["endY"])

  };

  // Called when an image loads (in the imageonload directive),
  // and we add all of the rectangles onto the page to be seen.
  public uploadSceneObjects() {
    if (this.pages[this.pageNumber].sceneObjects) {
      var sceneObjects = this.pages[this.pageNumber].sceneObjects;
      for (var i = 0; i < sceneObjects.length; i++) {
        var widthRatio = this.initialWidth / this.imageWidth;
        var heightRatio = this.initialHeight / this.imageHeight;

        var width = sceneObjects[i]["position"]["width"] * widthRatio;
        var height = sceneObjects[i]["position"]["height"] * heightRatio;
        var top = sceneObjects[i]["position"]["top"] * heightRatio;
        var left = sceneObjects[i]["position"]["left"] * widthRatio;

        var id = sceneObjects[i]["id"];
        var label = sceneObjects[i]["label"];

        let canvas = <HTMLCanvasElement> document.getElementById("drawnRectCanvas");
        var drawnRectCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");
        drawnRectCanvasContext.strokeRect(left, top, width, height);

        this.styleSceneObject(id, label);
      }
    }
  };

  // Adjusts the positioning of the label and delete button for the scene object
  // with the given id.
  private styleSceneObject(id, label) {
    var div = document.getElementById(id);
    var span = div.getElementsByTagName("span")[0];
    var button = div.getElementsByTagName("button")[0];

    var widthRatio = this.initialWidth / this.imageWidth;
    var heightRatio = this.initialHeight / this.imageHeight;
    var topLeftY;
    var topLeftX;
    var sceneObjects = this.pages[this.pageNumber].sceneObjects
    for (var i = 0; i < sceneObjects.length; i++) {
      if (sceneObjects[i].id == id) {
        var pos = sceneObjects[i]["position"];
        topLeftY = pos["top"] * heightRatio;
        topLeftX = pos["left"] * widthRatio;
      }
    }
    div.style.position = "absolute";

    // Align the delete button and label just slightly outside the top left corner
    // of the drawn rectangle box.
    console.log("styling scene object", id, label, label.length);
    div.style.top = (topLeftY - 15) + "px";
    div.style.left = (topLeftX - 10) + "px";

    button.style.order = "1";
    span.style.order = "2";
    span.style.width = (label.length * 6) + "px";

    button.className = "deleteButton";
    button.id = 'btn' + id;
    button.onclick = this.deleteSceneObject; //TODO ?? .bind(this);

  }
  // Called when hide/show scene objects appears.
  // Hides or shows the canvas that the bounding boxes are drawn on.
  public toggleSceneObjects() {
    this.sceneObjectsHidden.hidden = !this.sceneObjectsHidden.hidden;

    var drawnRectCanvasContext = document.getElementById("drawnRectCanvas");
    var divAll = document.getElementById("sceneObjectLabelButtonContainer");

    if (this.sceneObjectsHidden.hidden) {
      drawnRectCanvasContext.style.display = "none";
      divAll.style.display = "none";
    }
    else {
      drawnRectCanvasContext.style.display = "";
      divAll.style.display = "";
    }
  }

  // Delete a scene object.
  private deleteSceneObject() {
    var widthRatio = this.initialWidth / this.imageWidth;
    var heightRatio = this.initialHeight / this.imageHeight;
    var sizeX;
    var sizeY;
    var startY;
    var startX;
    console.log(`deleteSceneObject`, this);
    //TODO
    // var buttonid = parseInt(this.id.substr(3));
    // var sceneObjects = this.pages[this.pageNumber].sceneObjects;
    // var indexToDelete = null;
    // for (var i = 0; i < sceneObjects.length; i++) {
    //   var sceneObj = sceneObjects[i];
    //   if (sceneObj.id == buttonid) {
    //     sizeX = sceneObjects[i]["position"]["width"] * widthRatio;
    //     sizeY = sceneObjects[i]["position"]["height"] * heightRatio;
    //     startY = sceneObjects[i]["position"]["top"] * heightRatio;
    //     startX = sceneObjects[i]["position"]["left"] * widthRatio;
    //
    //     index = sceneObjects.indexOf(sceneObj);
    //   }
    // }
    //this.$apply(function() {
      // sceneObjects.splice(indexToDelete, 1);
    //});
    // let canvas;
    // canvas = <HTMLCanvasElement>  document.getElementsByClassName("drawing")[0];
    // var drawingCanvasContext = canvas.getContext("2d");
    // canvas = <HTMLCanvasElement> document.getElementById("drawnRectCanvas");
    // var drawnRectCanvasContext: CanvasRenderingContext2D = canvas.getContext("2d");
    //
    // // Clear the rectangle for the deleted scene object.
    // drawingCanvasContext.clearRect(startX - 2, startY - 2, sizeX + 4, sizeY + 4)
    // drawnRectCanvasContext.clearRect(startX - 2, startY - 2, sizeX + 4, sizeY + 4);
    //
    // // If any other scene objects overlap the deleted one, need to redraw
    // // them so that they show up correctly.
    // for (var i = 0; i < sceneObjects.length; i++) {
    //   let sizeX2 = sceneObjects[i]["position"]["width"] * widthRatio;
    //   let sizeY2 = sceneObjects[i]["position"]["height"] * heightRatio;
    //   let startY2 = sceneObjects[i]["position"]["top"] * heightRatio;
    //   let startX2 = sceneObjects[i]["position"]["left"] * widthRatio;
    //
    //   var maxAx = startX + sizeX;
    //   var minAx = startX;
    //   var maxAy = startY + sizeY;
    //   var minAy = startY;
    //
    //   var maxBx = startX2 + sizeX2;
    //   var minBx = startX2;
    //   var maxBy = startY2 + sizeY2;
    //   var minBy = startY2;
    //
    //   var aLeftOfB = (maxAx) < minBx;
    //   var aRightOfB = minAx > maxBx;
    //   var aAboveB = minAy > maxBy;
    //   var aBelowB = maxAy < minBy;
    //
    //   var intersect = !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
    //   if (intersect) {
    //     drawnRectCanvasContext.strokeRect(startX2, startY2, sizeX2, sizeY2);
    //   }
    // }
  }
}
