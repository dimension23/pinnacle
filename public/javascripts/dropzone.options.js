Dropzone.options.dropzoneLeft = {
  paramName: 'leftFile',
  maxFilesize: 2,
  maxFiles: 1,
  dictDefaultMessage: 'Drag an xliff here to upload, or click to select one',
  acceptedFiles: 'text/xml',
  init: function() {
    this.on('success', function(file, resp){
      console.log(file);
      console.log(resp);
    });
  }
};
Dropzone.options.dropzoneRight = {
  paramName: 'rightFile',
  maxFilesize: 2,
  maxFiles: 1,
  dictDefaultMessage: 'Drag an xliff here to upload, or click to select one',
  acceptedFiles: 'text/xml',
  init: function() {
    this.on('success', function(file, resp){
      console.log(file);
      console.log(resp);
    });
  }
};
