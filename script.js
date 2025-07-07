// DOM Elements
const messageInput = document.getElementById("message")
const keyInput = document.getElementById("key")
const keySlider = document.getElementById("keySlider")
const decreaseKey = document.getElementById("decreaseKey")
const increaseKey = document.getElementById("increaseKey")
const encryptBtn = document.getElementById("encryptBtn")
const resetBtn = document.getElementById("resetBtn")
const darkModeToggle = document.getElementById("darkModeToggle")
const messageBubble = document.getElementById("messageBubble")
const paperContent = document.getElementById("paperContent")
const originalAlphabet = document.getElementById("originalAlphabet")
const shiftedAlphabet = document.getElementById("shiftedAlphabet")
const shiftDisplay = document.getElementById("shiftDisplay")
const encryptionPreview = document.getElementById("encryptionPreview")
const waitingMessage = document.getElementById("waitingMessage")
const receivedContent = document.getElementById("receivedContent")
const encryptedMessageEl = document.getElementById("encryptedMessage")
const decryptedMessageEl = document.getElementById("decryptedMessage")
const decryptionProcess = document.getElementById("decryptionProcess")
const keyUsedEl = document.getElementById("keyUsed")
const exampleA = document.getElementById("exampleA")
const exampleZ = document.getElementById("exampleZ")
const exampleHello = document.getElementById("exampleHello")

// Initialize the app
function init() {
  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode")
  }

  // Generate alphabets
  generateAlphabets()

  // Set up event listeners
  setupEventListeners()

  // Update the example encryptions
  updateExamples()
}

// Generate original and shifted alphabets
function generateAlphabets() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // Clear previous content
  originalAlphabet.innerHTML = ""
  shiftedAlphabet.innerHTML = ""

  // Create original alphabet
  for (let i = 0; i < alphabet.length; i++) {
    const letter = document.createElement("div")
    letter.className = "letter"
    letter.textContent = alphabet[i]
    originalAlphabet.appendChild(letter)
  }

  // Create shifted alphabet based on current key
  const key = Number.parseInt(keyInput.value) || 3
  updateShiftedAlphabet(key)
}

// Update the shifted alphabet based on key
function updateShiftedAlphabet(key) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  // Clear previous content
  shiftedAlphabet.innerHTML = ""

  // Create shifted alphabet
  for (let i = 0; i < alphabet.length; i++) {
    const letter = document.createElement("div")
    letter.className = "letter"

    // Calculate shifted character (Caesar cipher)
    const charCode = alphabet.charCodeAt(i)
    const shiftedCharCode = ((charCode - 97 + key) % 26) + 97

    letter.textContent = String.fromCharCode(shiftedCharCode)
    shiftedAlphabet.appendChild(letter)
  }

  // Update the shift display
  shiftDisplay.textContent = key
}

// Set up event listeners
function setupEventListeners() {
  // Encryption button
  encryptBtn.addEventListener("click", encryptAndSend)

  // Reset button
  resetBtn.addEventListener("click", resetAll)

  // Dark mode toggle
  darkModeToggle.addEventListener("click", toggleDarkMode)

  // Key input controls
  keyInput.addEventListener("input", function () {
    let value = Number.parseInt(this.value) || 0
    if (value < 1) value = 1
    if (value > 25) value = 25
    this.value = value
    keySlider.value = value
    updateShiftedAlphabet(value)
    updateExamples()
    showEncryptionPreview()
  })

  keySlider.addEventListener("input", function () {
    const value = Number.parseInt(this.value)
    keyInput.value = value
    updateShiftedAlphabet(value)
    updateExamples()
    showEncryptionPreview()
  })

  decreaseKey.addEventListener("click", () => {
    let value = Number.parseInt(keyInput.value) || 0
    if (value > 1) {
      value--
      keyInput.value = value
      keySlider.value = value
      updateShiftedAlphabet(value)
      updateExamples()
      showEncryptionPreview()
    }
  })

  increaseKey.addEventListener("click", () => {
    let value = Number.parseInt(keyInput.value) || 0
    if (value < 25) {
      value++
      keyInput.value = value
      keySlider.value = value
      updateShiftedAlphabet(value)
      updateExamples()
      showEncryptionPreview()
    }
  })

  // Preview encryption as user types message
  messageInput.addEventListener("input", showEncryptionPreview)
}

// Update the examples
function updateExamples() {
  const key = Number.parseInt(keyInput.value) || 3

  exampleA.textContent = caesarCipherEncrypt("a", key)
  exampleZ.textContent = caesarCipherEncrypt("z", key)
  exampleHello.textContent = caesarCipherEncrypt("hello", key)
}

// Show live encryption preview as user types
function showEncryptionPreview() {
  const message = messageInput.value
  const key = Number.parseInt(keyInput.value) || 3

  if (!message) {
    encryptionPreview.innerHTML = "<em>Type a message to see encryption preview...</em>"
    return
  }

  encryptionPreview.innerHTML = ""

  // Process each character for preview
  for (let i = 0; i < message.length; i++) {
    const char = message[i]
    const previewChar = document.createElement("span")
    previewChar.className = "preview-char"

    // Only encrypt letters
    if (/[a-zA-Z]/.test(char)) {
      const original = char
      const encrypted = caesarCipherEncrypt(char, key)

      previewChar.textContent = original
      previewChar.dataset.original = original
      previewChar.dataset.encrypted = encrypted
      previewChar.className = "preview-char"

      // Add a slight delay for each character to create a wave effect
      setTimeout(() => {
        // Show the transformation animation
        previewChar.classList.add("encrypting")

        // Add the transformation arrow
        const arrow = document.createElement("span")
        arrow.className = "char-arrow"
        arrow.textContent = `${original} → ${encrypted}`
        previewChar.appendChild(arrow)

        // Highlight corresponding letters in the alphabet
        highlightAlphabetLetter(original, encrypted)

        // After animation, show the encrypted character
        setTimeout(() => {
          previewChar.textContent = encrypted
          previewChar.classList.remove("encrypting")
          previewChar.classList.add("encrypted")

          // Remove highlight after a delay
          setTimeout(() => {
            unhighlightAlphabetLetters()
          }, 300)
        }, 600)
      }, i * 150)
    } else {
      previewChar.textContent = char
    }

    encryptionPreview.appendChild(previewChar)
  }
}

/**
 * Caesar Cipher encryption function
 * @param {string} text - The text to encrypt
 * @param {number} key - The encryption key (shift value)
 * @returns {string} - The encrypted text
 */
function caesarCipherEncrypt(text, key) {
  return text
    .split("")
    .map((char) => {
      // Check if the character is a letter
      if (/[a-zA-Z]/.test(char)) {
        // Determine the ASCII offset based on case
        const offset = char.toLowerCase() === char ? 97 : 65
        // Convert to ASCII, apply shift, and convert back to character
        const shifted = ((char.charCodeAt(0) - offset + key) % 26) + offset
        return String.fromCharCode(shifted)
      }
      // Return non-letter characters unchanged
      return char
    })
    .join("")
}

/**
 * Caesar Cipher decryption function
 * @param {string} text - The text to decrypt
 * @param {number} key - The decryption key (shift value)
 * @returns {string} - The decrypted text
 */
function caesarCipherDecrypt(text, key) {
  return caesarCipherEncrypt(text, 26 - key)
}

/**
 * Animates the encryption of a character
 * @param {Element} charElement - The DOM element of the character
 * @param {string} originalChar - The original character
 * @param {string} encryptedChar - The encrypted character
 * @param {number} delay - Animation delay in milliseconds
 */
function animateEncryption(charElement, originalChar, encryptedChar, delay) {
  setTimeout(() => {
    // Add the encrypting class to highlight the current character
    charElement.classList.add("encrypting")

    // Show the transformation arrow
    const arrow = document.createElement("span")
    arrow.className = "char-arrow"
    arrow.textContent = `${originalChar} → ${encryptedChar}`
    charElement.appendChild(arrow)

    // Highlight the corresponding letters in the alphabet
    highlightAlphabetLetter(originalChar, encryptedChar)

    // After a brief delay, complete the encryption
    setTimeout(() => {
      charElement.textContent = encryptedChar
      charElement.classList.remove("encrypting")
      charElement.classList.add("encrypted")

      // Unhighlight the alphabet letters
      unhighlightAlphabetLetters()
    }, 800)
  }, delay)
}

/**
 * Animates the decryption of a character
 * @param {Element} charElement - The DOM element of the character
 * @param {string} encryptedChar - The encrypted character
 * @param {string} decryptedChar - The decrypted character
 * @param {number} delay - Animation delay in milliseconds
 */
function animateDecryption(charElement, encryptedChar, decryptedChar, delay) {
  setTimeout(() => {
    // Add the decrypting class to highlight the current character
    charElement.classList.add("decrypting")

    // Show the transformation arrow
    const arrow = document.createElement("span")
    arrow.className = "char-arrow"
    arrow.textContent = `${encryptedChar} → ${decryptedChar}`
    charElement.appendChild(arrow)

    // After a brief delay, complete the decryption
    setTimeout(() => {
      charElement.textContent = decryptedChar
      charElement.classList.remove("decrypting")
      charElement.classList.add("decrypted")
    }, 800)
  }, delay)
}

/**
 * Highlights corresponding letters in the alphabet displays
 * @param {string} originalChar - The original character
 * @param {string} encryptedChar - The encrypted character
 */
function highlightAlphabetLetter(originalChar, encryptedChar) {
  const char = originalChar.toLowerCase()

  if (/[a-z]/.test(char)) {
    const index = char.charCodeAt(0) - 97

    // Find the encrypted character's index
    const encryptedIndex = encryptedChar.toLowerCase().charCodeAt(0) - 97

    // Highlight the original letter
    const originalLetters = originalAlphabet.querySelectorAll(".letter")
    if (originalLetters[index]) {
      originalLetters[index].classList.add("highlighted")
    }

    // Highlight the shifted letter
    const shiftedLetters = shiftedAlphabet.querySelectorAll(".letter")
    if (shiftedLetters[index]) {
      shiftedLetters[index].classList.add("highlighted")
    }

    // Draw a connection line between the letters (visual cue)
    // This is handled by CSS, we just need to add the right classes
  }
}

/**
 * Removes highlights from all alphabet letters
 */
function unhighlightAlphabetLetters() {
  const letters = document.querySelectorAll(".letter")
  letters.forEach((letter) => {
    letter.classList.remove("highlighted")
  })
}

/**
 * Animates the particles around the message bubble
 */
function animateParticles() {
  const particles = document.querySelectorAll(".particle")

  particles.forEach((particle, index) => {
    // Random positions for particles to float to
    const tx = (Math.random() - 0.5) * 60
    const ty = (Math.random() - 0.5) * 60

    // Set particle position and animation
    particle.style.setProperty("--tx", `${tx}px`)
    particle.style.setProperty("--ty", `${ty}px`)

    // Random positions around the bubble
    const angle = (index / particles.length) * Math.PI * 2
    const distance = 30 + Math.random() * 10

    particle.style.left = `${50 + Math.cos(angle) * distance}%`
    particle.style.top = `${50 + Math.sin(angle) * distance}%`

    // Animate with delay
    setTimeout(() => {
      particle.style.animation = `particleFloat 2s ease-out forwards`
    }, index * 200)
  })
}

/**
 * Main function to encrypt and animate sending the message
 */
function encryptAndSend() {
  const message = messageInput.value.trim()
  const key = Number.parseInt(keyInput.value) || 3

  // Validate inputs
  if (!message) {
    alert("Please enter a message")
    return
  }

  if (isNaN(key) || key < 1 || key > 25) {
    alert("Please enter a valid key between 1 and 25")
    return
  }

  // First, animate the encryption process in the preview
  encryptionPreview.innerHTML = ""

  // Show a "processing" indicator
  const processingIndicator = document.createElement("div")
  processingIndicator.className = "processing-indicator"
  processingIndicator.textContent = "Encrypting..."
  encryptionPreview.appendChild(processingIndicator)

  setTimeout(() => {
    // Remove the processing indicator
    encryptionPreview.innerHTML = ""

    // Animate each character being encrypted
    for (let i = 0; i < message.length; i++) {
      const char = message[i]
      const charSpan = document.createElement("span")
      charSpan.className = "preview-char"
      charSpan.textContent = char
      encryptionPreview.appendChild(charSpan)

      if (/[a-zA-Z]/.test(char)) {
        const encrypted = caesarCipherEncrypt(char, key)

        // Stagger the animation
        setTimeout(() => {
          charSpan.classList.add("encrypting")

          // Show transformation arrow
          const arrow = document.createElement("span")
          arrow.className = "char-arrow"
          arrow.textContent = `${char} → ${encrypted}`
          charSpan.appendChild(arrow)

          // Highlight alphabet letters
          highlightAlphabetLetter(char, encrypted)

          // After animation, show encrypted character
          setTimeout(() => {
            charSpan.textContent = encrypted
            charSpan.classList.remove("encrypting")
            charSpan.classList.add("encrypted")

            unhighlightAlphabetLetters()
          }, 600)
        }, i * 150)
      }
    }

    // After all characters are encrypted, start the sending animation
    const encryptedMessage = caesarCipherEncrypt(message, key)

    setTimeout(
      () => {
        // Set content for animated bubble
        paperContent.textContent = encryptedMessage.substring(0, 20) + (encryptedMessage.length > 20 ? "..." : "")

        // Start the message animation
        messageBubble.style.animation = "sendMessage 3s ease-in-out forwards"

        // Animate the paper
        setTimeout(() => {
          document.querySelector(".message-paper").style.animation = "paperRotate 2s ease-in-out"

          // Animate particles
          animateParticles()
        }, 300)

        // After animation completes, show the received message
        setTimeout(() => {
          // Hide waiting message and show received content
          waitingMessage.style.display = "none"
          receivedContent.style.display = "block"

          // Display the encrypted message immediately
          encryptedMessageEl.textContent = encryptedMessage

          // Animate the decryption process
          animateDecryptionProcess(encryptedMessage, message, key)

          // Set the key used
          keyUsedEl.textContent = key

          // Reset the message bubble animation
          setTimeout(() => {
            messageBubble.style.animation = "none"
            document.querySelector(".message-paper").style.animation = "none"

            // Reset particles
            const particles = document.querySelectorAll(".particle")
            particles.forEach((particle) => {
              particle.style.animation = "none"
              particle.style.opacity = "0"
            })
          }, 500)
        }, 3000)
      },
      message.length * 150 + 500,
    )
  }, 800)
}

/**
 * Animates the decryption process character by character
 * @param {string} encryptedMsg - The encrypted message
 * @param {string} originalMsg - The original message
 * @param {number} key - The encryption key
 */
function animateDecryptionProcess(encryptedMsg, originalMsg, key) {
  decryptionProcess.innerHTML = ""

  // Add each character as a separate span for animation
  for (let i = 0; i < encryptedMsg.length; i++) {
    const charSpan = document.createElement("span")
    charSpan.className = "preview-char encrypted"
    charSpan.textContent = encryptedMsg[i]
    decryptionProcess.appendChild(charSpan)

    // Only animate letters
    if (/[a-zA-Z]/.test(encryptedMsg[i])) {
      // Stagger the animation for each character
      setTimeout(() => {
        // Add visual indicator for the current character being decrypted
        charSpan.classList.add("decrypting")

        // Show the transformation arrow
        const arrow = document.createElement("span")
        arrow.className = "char-arrow"
        arrow.textContent = `${encryptedMsg[i]} → ${originalMsg[i]}`
        charSpan.appendChild(arrow)

        // Highlight corresponding letters in the alphabet
        highlightAlphabetLetter(originalMsg[i], encryptedMsg[i])

        // After a delay, complete the transformation
        setTimeout(() => {
          charSpan.textContent = originalMsg[i]
          charSpan.classList.remove("decrypting")
          charSpan.classList.add("decrypted")

          // Remove highlight after a delay
          setTimeout(() => {
            unhighlightAlphabetLetters()
          }, 300)
        }, 800)
      }, i * 200)
    }
  }

  // After all characters are animated, show the full decrypted message
  setTimeout(
    () => {
      decryptedMessageEl.textContent = originalMsg
      decryptedMessageEl.style.animation = "letterFadeIn 0.5s ease-in-out forwards"
    },
    encryptedMsg.length * 200 + 1000,
  )
}

/**
 * Reset all inputs and displays
 */
function resetAll() {
  // Clear inputs
  messageInput.value = ""
  keyInput.value = "3"
  keySlider.value = "3"

  // Reset receiver panel
  waitingMessage.style.display = "flex"
  receivedContent.style.display = "none"

  // Reset message bubble animation
  messageBubble.style.animation = "none"
  paperContent.textContent = ""

  // Reset paper animation
  document.querySelector(".message-paper").style.animation = "none"

  // Reset particles
  const particles = document.querySelectorAll(".particle")
  particles.forEach((particle) => {
    particle.style.animation = "none"
    particle.style.opacity = "0"
  })

  // Reset encryption preview
  encryptionPreview.innerHTML = "<em>Type a message to see encryption preview...</em>"

  // Update shifted alphabet and examples
  updateShiftedAlphabet(3)
  updateExamples()

  // Focus on message input
  messageInput.focus()
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode")

  // Save preference to localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled")
  } else {
    localStorage.setItem("darkMode", "disabled")
  }
}

// Initialize the app
window.addEventListener("DOMContentLoaded", init)
