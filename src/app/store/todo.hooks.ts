export function todoHooks() {
  return {
    onInit({ loadAllTodos }) {
      console.log('on init');
      loadAllTodos();
    },
    onDestroy() {
      console.log('count on destroy');
    },
  };
}
