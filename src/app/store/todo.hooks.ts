export function todoHooks() {
  return {
    onInit({ loadAllTodosByPromise }) {
      console.log('on init');
      loadAllTodosByPromise();
    },
    onDestroy() {
      console.log('count on destroy');
    },
  };
}
