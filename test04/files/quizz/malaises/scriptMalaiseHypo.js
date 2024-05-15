//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: []
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml
    };
    this.update();
  
    let feedbackText;
    if (detail.answer.isCorrect) {
      feedbackText = "Correct! ";
    } else {
      feedbackText = "Incorrect. ";
    }
    feedbackText += detail.answer.comment; // Ajouter le commentaire à la réponse
  
    this.questionFeedback.innerHTML = feedbackText;
  
    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer
        }
      })
    );
  };
  

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("div");
    this.questionText.classList.add("titreQuestion");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer
            }
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Exact !";
    incorrectFeedback = "Non.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
    {
      text: "Qu'est-ce que l'hypoglycémie chez un diabétique et quelles en sont les principales causes ?",
      answers: [
        { text: "L'hypoglycémie est une baisse du taux de sucre dans le sang chez un diabétique, souvent causée par une alimentation inadaptée, un exercice physique inhabituel, un excès de traitement, la déshydratation ou la fièvre.", isCorrect: true, comment: "L'hypoglycémie chez un diabétique peut être due à plusieurs facteurs." },
        { text: "L'hypoglycémie est une augmentation du taux de sucre dans le sang chez un diabétique, causée par une alimentation excessive en sucre.", isCorrect: false, comment: "Non, l'hypoglycémie correspond à une baisse du taux de sucre dans le sang." },
        { text: "L'hypoglycémie est une condition normale chez les diabétiques et n'a pas de causes spécifiques.", isCorrect: false, comment: "Non, l'hypoglycémie est une condition à risque pour les diabétiques et peut avoir différentes causes." },
        { text: "L'hypoglycémie est une baisse du taux d'insuline dans le sang chez un diabétique, causée par une mauvaise absorption de l'insuline par l'organisme.", isCorrect: false, comment: "Non, l'hypoglycémie est une baisse du taux de sucre, pas d'insuline." }
      ]
    },
    {
      text: "Comment les diabétiques surveillent-ils leur taux de sucre sanguin et quel est l'outil utilisé à cet effet ?",
      answers: [
        { text: "Les diabétiques surveillent leur taux de sucre sanguin à l'aide d'une analyse d'urine.", isCorrect: false, comment: "Non, la mesure de la glycémie se fait généralement à partir d'une goutte de sang." },
        { text: "Les diabétiques surveillent leur taux de sucre sanguin à l'aide d'un lecteur de glycémie, qui mesure la glycémie à partir d'une goutte de sang prélevée au niveau du doigt.", isCorrect: true, comment: "Exact ! Le lecteur de glycémie est un outil essentiel pour les diabétiques."},
        { text: "Les diabétiques surveillent leur taux de sucre sanguin en mesurant leur tension artérielle.", isCorrect: false, comment: "Non, la mesure de la tension artérielle ne fournit pas d'informations sur le taux de sucre sanguin." },
        { text: "Les diabétiques surveillent leur taux de sucre sanguin en se basant uniquement sur leurs symptômes.", isCorrect: false, comment: "Non, il est important d'utiliser un dispositif de mesure pour obtenir des données précises." }
      ]
    },
    {
      text: "Quels sont les signes d'un malaise hypoglycémique chez un diabétique et comment peuvent-ils évoluer ?",
      answers: [
        { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont uniquement une perte de connaissance et des convulsions.", isCorrect: false, comment: "Non, l'hypoglycémie peut se manifester par divers symptômes, pas seulement une perte de connaissance et des convulsions."},
        { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont toujours les mêmes et n'évoluent jamais.", isCorrect: false, comment: "Non, les symptômes d'hypoglycémie peuvent varier d'une personne à l'autre et évoluer en fonction de la situation." },
        { text: "Les signes d'un malaise hypoglycémique chez un diabétique peuvent inclure une perte de connaissance, des convulsions, un trouble du comportement, des sueurs abondantes et une pâleur. Ces symptômes peuvent évoluer vers une détresse neurologique ou être suivis de plaintes telles que la faim, la fatigue, des palpitations et des tremblements.", isCorrect: true, comment: "Correct ! Les signes d'hypoglycémie chez un diabétique peuvent varier et évoluer en fonction de la gravité de la situation."  },
        { text: "Les signes d'un malaise hypoglycémique chez un diabétique sont uniquement une faiblesse musculaire et des vertiges.", isCorrect: false, comment: "Non, l'hypoglycémie peut entraîner différents symptômes, y compris ceux mentionnés, mais pas exclusivement." }
      ]
    },
    {
      text: "Quelle est la valeur seuil indiquant une hypoglycémie chez un diabétique, et quelles sont les unités de mesure utilisées pour la glycémie ?",
      answers: [
        { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est < 10 mmol/l (ou < 180 mg/dl ou < 1,0 g/l).", isCorrect: false, comment: "Non, ces valeurs indiqueraient généralement une glycémie normale ou élevée, pas une hypoglycémie." },
        { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est > 3,3 mmol/l (ou > 60 mg/dl ou > 0,6 g/l).", isCorrect: false, comment: "Non, une valeur supérieure indiquerait une hyperglycémie, pas une hypoglycémie." },
        { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est > 10 mmol/l (ou > 180 mg/dl ou > 1,0 g/l).", isCorrect: false, comment: "Non, ces valeurs indiqueraient généralement une hyperglycémie, pas une hypoglycémie." },
        { text: "Une victime est considérée en hypoglycémie si la valeur mesurée de la glycémie est < 3,3 mmol/l (ou < 60 mg/dl ou < 0,6 g/l). Les unités de mesure de la glycémie sont le millimole par litre (mmol/l), le milligramme par décilitre (mg/dl) ou le gramme par litre (g/l).", isCorrect: true, comment: "Exact ! Ces valeurs seuils indiquent une hypoglycémie chez un diabétique, avec différentes unités de mesure possibles." }
      ]
    },
    {
      text: "Quelles sont les actions de secours à entreprendre en cas de perte de conscience chez un diabétique ?",
      answers: [
        { text: "En cas de perte de conscience chez un diabétique, appliquer la conduite à tenir adaptée, réaliser une mesure de glycémie capillaire lors du 4ème regard si la victime respire, et demander un avis médical.", isCorrect: true, comment: "Correct ! La sécurité de la victime et l'appel à un avis médical sont essentiels en cas de perte de conscience." },
        { text: "En cas de perte de conscience chez un diabétique, donner immédiatement du sucre à la victime et attendre son réveil.", isCorrect: false, comment: "Non, il est important de sécuriser la victime et d'obtenir un avis médical avant d'administrer du sucre, surtout si la cause de la perte de conscience n'est pas claire." },
        { text: "En cas de perte de conscience chez un diabétique, réaliser une mesure de tension artérielle et maintenir la victime dans une position confortable.", isCorrect: false, comment: "Non, la mesure de la tension artérielle n'est pas une priorité en cas de perte de conscience chez un diabétique." },
        { text: "En cas de perte de conscience chez un diabétique, administrer immédiatement de l'insuline à la victime pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée en cas de perte de conscience sans avis médical, car cela peut aggraver la situation." }
      ]
    },
    {
      text: "Que doit faire un secouriste si une victime consciente présente des signes d'hypoglycémie ?",
      answers: [
        { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit administrer immédiatement de l'insuline à la victime pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
        { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit réaliser une mesure de glycémie capillaire, aider la victime à prendre du sucre si nécessaire, demander un avis médical en cas de doute et surveiller la victime.", isCorrect: true, comment: "Correct ! Il est important d'évaluer la glycémie, d'administrer du sucre si nécessaire et de surveiller la victime en attendant un avis médical." },
        { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit lui donner immédiatement du sucre sans réaliser de mesure de glycémie.", isCorrect: false, comment: "Non, il est important de mesurer la glycémie avant d'administrer du sucre pour éviter une hyperglycémie." },
        { text: "Si une victime consciente présente des signes d'hypoglycémie, le secouriste doit laisser la victime se reposer et attendre que les symptômes disparaissent d'eux-mêmes.", isCorrect: false, comment: "Non, il est nécessaire d'évaluer la glycémie et d'agir en conséquence pour traiter l'hypoglycémie." }
      ]
    },
    {
      text: "Quelle est la dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie ?",
      answers: [
        { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une barre de chocolat.", isCorrect: false, comment: "Non, les barres de chocolat peuvent contenir d'autres ingrédients qui ne sont pas aussi efficaces que le sucre pur pour traiter l'hypoglycémie." },
        { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une cuillère à soupe de sucre.", isCorrect: false, comment: "Non, une dose plus importante est généralement recommandée pour traiter l'hypoglycémie." },
        { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est de préférence du sucre en morceaux ou en poudre (4 morceaux ou cuillères à café de sucre), sinon une boisson sucrée comme un jus d'orange ou du miel. Pour les enfants, deux à trois morceaux ou cuillères à café de sucre sont recommandés.", isCorrect: true, comment: "Correct ! Ces doses sont recommandées pour aider à augmenter rapidement le taux de sucre sanguin." },
        { text: "La dose recommandée de sucre à donner à une victime consciente en cas d'hypoglycémie est une demi-cuillère à café de sucre.", isCorrect: false, comment: "Non, une dose plus importante est généralement nécessaire pour traiter efficacement l'hypoglycémie." }
      ]
    },
    {
      text: "Quelles mesures doivent être prises si une victime ne présente pas d'amélioration après avoir ingéré du sucre ?",
      answers: [
        { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui administrer un médicament anti-hypoglycémique.", isCorrect: false, comment: "Non, l'administration de médicaments ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
        { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui administrer de l'insuline pour augmenter son taux de sucre sanguin.", isCorrect: false, comment: "Non, l'administration d'insuline ne doit pas être effectuée sans avis médical, car cela peut aggraver la situation." },
        { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, il faut lui donner de l'eau pour diluer le sucre dans son organisme.", isCorrect: false, comment: "Non, l'eau seule ne suffit pas à traiter l'hypoglycémie et peut diluer le sucre dans le sang, ce qui peut être dangereux." },
        { text: "Si une victime ne présente pas d'amélioration après avoir ingéré du sucre, une seconde dose de sucre peut être prise après environ 15 minutes. Si aucune amélioration ne survient au bout de 15 minutes suivant la deuxième dose de sucre, un avis médical doit être demandé.", isCorrect: true, comment: "Correct ! Il est important de surveiller la réaction de la victime et de demander un avis médical si les symptômes persistent." }
      ]
    },
    {
      text: "Pourquoi est-il important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique ?",
      answers: [
        { text: "Il n'est pas nécessaire de demander un avis médical en cas de malaise hypoglycémique chez un diabétique, car il suffit généralement de prendre du sucre pour rétablir la situation.", isCorrect: false, comment: "Non, un avis médical peut être nécessaire pour évaluer la gravité de la situation et déterminer les mesures à prendre pour prévenir les récidives." },
        { text: "Il est important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique pour évaluer la situation de manière professionnelle, déterminer la cause sous-jacente du malaise et fournir le traitement approprié si nécessaire.", isCorrect: true, comment: "Correct ! Un avis médical peut aider à identifier les causes sous-jacentes de l'hypoglycémie et à fournir un traitement approprié." },
        { text: "Il est important de demander un avis médical en cas de malaise hypoglycémique chez un diabétique pour éviter toute responsabilité légale en cas de complications.", isCorrect: false, comment: "Non, la principale raison de demander un avis médical est d'assurer le bien-être et la sécurité de la victime, pas uniquement pour des considérations légales." },
        { text: "Il n'est pas nécessaire de demander un avis médical en cas de malaise hypoglycémique chez un diabétique, car il s'agit généralement d'une situation bénigne qui peut être traitée à domicile.", isCorrect: false, comment: "Non, même si l'hypoglycémie peut être traitée à domicile, un avis médical peut être nécessaire pour évaluer la cause sous-jacente et prévenir les récidives." }
      ]
    },
    {
      text: "Quel est le délai d'attente recommandé entre l'ingestion de sucre et l'amélioration des symptômes chez une victime d'hypoglycémie ?",
      answers: [
        { text: "Il faut compter environ 10 à 15 minutes entre l'ingestion du sucre, une élévation de la glycémie et une amélioration des signes chez une victime d'hypoglycémie.", isCorrect: true, comment: "Correct ! Il est important de surveiller la réaction de la victime après avoir ingéré du sucre et de réagir en cas de besoin." },
        { text: "Il faut compter environ 30 minutes entre l'ingestion du sucre et une amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, un délai aussi long pourrait indiquer une réponse insuffisante au traitement et nécessiter une intervention supplémentaire." },
        { text: "Il faut compter environ 5 minutes entre l'ingestion du sucre et une amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, un délai aussi court peut être insuffisant pour observer une amélioration significative des symptômes." },
        { text: "Il n'y a pas de délai recommandé entre l'ingestion de sucre et l'amélioration des symptômes chez une victime d'hypoglycémie.", isCorrect: false, comment: "Non, il est important de surveiller la réaction de la victime après avoir ingéré du sucre pour déterminer si d'autres mesures sont nécessaires." }
      ]
    }
  
];


// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${5}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(questionsData);

// creating questions
for (var i = 0; i < 5; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
