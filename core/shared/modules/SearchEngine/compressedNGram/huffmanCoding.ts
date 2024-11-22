interface HuffmanNode {
   char: string;
   weight: number;
   left?: HuffmanNode;
   right?: HuffmanNode;
}

export function buildHuffmanTree(frequencies: { [char: string]: number }): HuffmanNode | null {
   const nodes: HuffmanNode[] = [];

   // Créer un nœud pour chaque caractère avec sa fréquence
   for (const char in frequencies) {
      nodes.push({ char, weight: frequencies[char] });
   }

   // Construire l'arbre de Huffman
   while (nodes.length > 1) {
      // Trier les nœuds par poids croissant
      nodes.sort((a, b) => a.weight - b.weight);

      // Prendre les deux nœuds avec les poids les plus faibles
      const left = nodes.shift()!;
      const right = nodes.shift()!;

      // Créer un nouveau nœud parent avec la somme des poids
      const parent: HuffmanNode = {
         char: null!,
         weight: left.weight + right.weight,
         left,
         right,
      };

      // Ajouter le nœud parent à la liste des nœuds
      nodes.push(parent);
   }

   // L'arbre de Huffman est stocké dans le seul nœud restant
   return nodes[0] || null;
}

export function encode(text: string, huffmanTree: HuffmanNode): string {
   let encoded = "";
   const codes: { [char: string]: string } = {};

   // Construire les codes de Huffman pour chaque caractère
   function buildCodes(node: HuffmanNode, currentCode: string) {
      if (!node.left && !node.right) {
         codes[node.char] = currentCode;
      } else {
         node.left && buildCodes(node.left, currentCode + "0");
         node.right && buildCodes(node.right, currentCode + "1");
      }
   }

   buildCodes(huffmanTree, "");

   // Encoder le texte en utilisant les codes de Huffman
   for (const char of text) {
      encoded += codes[char];
   }

   return encoded;
}

export function decode(encoded: string, huffmanTree: HuffmanNode): string {
   let decoded = "";
   let currentNode = huffmanTree;

   for (const bit of encoded) {
      if (bit === "0") {
         currentNode = currentNode.left!;
      } else {
         currentNode = currentNode.right!;
      }

      if (!currentNode.left && !currentNode.right) {
         decoded += currentNode.char;
         currentNode = huffmanTree;
      }
   }

   return decoded;
}
