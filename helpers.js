export function printAvailableKeysForActiveGear(availableTransitions) {
  let message = "";

  if (availableTransitions.includes('R')) {
    message += " [R->Reverse Gear]";
  }

  if (availableTransitions.includes('N')) {
    message += " [N->Neutral Gear]";
  }

  if (availableTransitions.includes('1')) {
    message += " [1->First Gear]";
  }

  if (availableTransitions.includes('2')) {
    message += " [2->Second Gear]";
  }

  if (availableTransitions.includes('3')) {
    message += " [3->Third Gear]";
  }

  if (availableTransitions.includes('4')) {
    message += " [4->Fourth Gear]";
  }

  message += " [W->Accelerate] [S->Brake]";
  return message;
}