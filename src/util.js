export const parseCoordValue = (element) => {
  const value = parseFloat(element.value);

  return !isNaN(value) ? value : null;
};

export const toggleClipboardIcon = (element) => {
  element.innerHTML = `<i class="fa-solid fa-check text-green-500"></i>`;

  setTimeout(() => {
    element.innerHTML = `<i class="fa-solid fa-copy"></i>`;
  }, 1000);
};
