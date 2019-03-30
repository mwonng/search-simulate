class ErrorHandler {
  entityNotAvailable() {
    throw new Error('no entity data');
  }

  fieldNotAvailable() {
    throw new Error('no field data');
  }
}