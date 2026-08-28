const products = [
  { name: "Organic Bananas", detail: "One bunch · approx. 2.5 lb", category: "Grocery", actual: 1.49, guess: .89, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1000&q=85" },
  { name: "Specialty Coffee", detail: "12 oz bag · whole bean", category: "Pantry", actual: 14.99, guess: 17.50, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=85" },
  { name: "Scented Candle", detail: "Medium jar · 18 oz", category: "Home", actual: 24.00, guess: 18.00, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85" },
  { name: "Avocado Toast", detail: "One serving · neighborhood café", category: "Dining", actual: 12.50, guess: 14.00, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1000&q=85" },
  { name: "Running Shoes", detail: "One pair · everyday trainer", category: "Apparel", actual: 94.99, guess: 80.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85" },
  { name: "Olive Oil", detail: "Extra virgin · 25 fl oz", category: "Grocery", actual: 13.49, guess: 15.99, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=85" },
  { name: "Houseplant", detail: "Medium monstera · ceramic pot", category: "Home", actual: 34.00, guess: 28.00, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=85" },
  { name: "Wireless Headphones", detail: "Over-ear · noise cancelling", category: "Tech", actual: 129.99, guess: 149.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85" }
];

const $ = id => document.getElementById(id);
let deck = [], current, streak = 0, round = 0, gameOver = false;
let best = Number(localStorage.getItem("pricePeekBest") || 0);

function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function money(value) { return value.toFixed(2); }

function startGame() {
  deck = shuffle(products); streak = 0; round = 0; gameOver = false;
  $("resultOverlay").hidden = true; updateScores(); nextProduct();
}

function nextProduct() {
  if (!deck.length) deck = shuffle(products);
  current = deck.pop(); round += 1;
  $("productImage").style.opacity = 0;
  $("productImage").src = current.image;
  $("productImage").alt = current.name;
  $("productImage").onload = () => $("productImage").style.opacity = 1;
  $("category").textContent = current.category;
  $("productName").textContent = current.name;
  $("productDetail").textContent = current.detail;
  $("shownPrice").textContent = money(current.guess);
  document.querySelectorAll(".buttonPrice").forEach(el => el.textContent = money(current.guess));
  $("roundLabel").textContent = `ROUND ${round}`;
  $("progressLabel").textContent = `${streak} / 10`;
  $("progressBar").style.width = `${Math.min(streak, 10) * 10}%`;
}

function updateScores() {
  $("headerStreak").textContent = streak;
  $("bestScore").textContent = best;
}

function answer(choice) {
  if (!$("resultOverlay").hidden) return;
  const correct = current.actual > current.guess ? "higher" : "lower";
  const won = choice === correct;
  if (won) {
    streak += 1;
    if (streak > best) { best = streak; localStorage.setItem("pricePeekBest", best); }
  } else { gameOver = true; }
  updateScores();
  $("resultIcon").textContent = won ? "✓" : "×";
  $("resultIcon").style.background = won ? "#164f42" : "#b4473d";
  $("resultEyebrow").textContent = won ? "NICE CALL!" : "NOT QUITE";
  $("resultTitle").textContent = won ? "That’s right" : "Game over";
  $("resultCopy").textContent = `${current.name} typically costs $${money(current.actual)}. ${won ? `Your streak is now ${streak}.` : `You finished with a streak of ${streak}.`}`;
  $("nextButton").innerHTML = won ? "Next item <span>→</span>" : "Play again <span>↻</span>";
  $("resultOverlay").hidden = false;
  $("nextButton").focus();
}

document.querySelectorAll(".answer").forEach(button => button.addEventListener("click", () => answer(button.dataset.answer)));
$("nextButton").addEventListener("click", () => gameOver ? startGame() : ($("resultOverlay").hidden = true, nextProduct()));
document.addEventListener("keydown", event => {
  if (!$("resultOverlay").hidden) { if (event.key === "Enter") $("nextButton").click(); return; }
  if (event.key === "ArrowLeft") answer("lower");
  if (event.key === "ArrowRight") answer("higher");
});

$("bestScore").textContent = best;
startGame();
