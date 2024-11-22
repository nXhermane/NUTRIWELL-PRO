export default function* uniqueIdGenerator() {
   let id = 0;
   while (true) {
      yield id++;
   }
}
