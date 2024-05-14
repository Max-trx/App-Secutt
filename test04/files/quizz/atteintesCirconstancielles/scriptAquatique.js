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
    "text": "Qu'est-ce qu'un accident lié à la plongée ?",
    "answers": [
        {
            "text": "Une manifestation qui survient pendant une plongée en apnée uniquement.",
            "isCorrect": false,
            "comment": "Les accidents de plongée ne se limitent pas à la plongée en apnée."
        },
        {
            "text": "Une manifestation qui survient après une plongée en scaphandre autonome uniquement.",
            "isCorrect": false,
            "comment": "Les accidents de plongée ne se limitent pas à la plongée en scaphandre autonome."
        },
        {
            "text": "Une manifestation qui survient pendant, immédiatement après ou dans les vingt-quatre heures qui suivent une plongée en apnée ou en scaphandre autonome.",
            "isCorrect": true,
            "comment": "Un accident de plongée peut survenir pendant, immédiatement après ou jusqu'à 24 heures après une plongée en apnée ou en scaphandre autonome."
        },
        {
            "text": "Toutes les réponses précédentes sont correctes.",
            "isCorrect": false,
            "comment": "Seule la troisième réponse est correcte pour définir un accident lié à la plongée."
        }
    ]
},
{
  "text": "Qu'est-ce qu'un accident barotraumatique ?",
  "answers": [
      {
          "text": "Un accident provoqué par une variation des volumes de gaz dans les cavités naturelles et pathologiques de l'organisme.",
          "isCorrect": true,
          "comment": "Un accident barotraumatique est provoqué par une variation des volumes de gaz dans les cavités naturelles et pathologiques de l'organisme."
      },
      {
          "text": "Un accident toxique dû à une exposition à des gaz contaminants.",
          "isCorrect": false,
          "comment": "Ce type d'accident n'est pas appelé barotraumatique."
      },
      {
          "text": "Un accident provoqué par une insensibilité à la baisse de la quantité d'oxygène dans le sang.",
          "isCorrect": false,
          "comment": "Ce type d'accident n'est pas appelé barotraumatique."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la première réponse est correcte pour définir un accident barotraumatique."
      }
  ]
},

{
  "text": "Qu'est-ce qui peut entraîner une surpression pulmonaire lors de la remontée en plongée ?",
  "answers": [
      {
          "text": "Un blocage de l'inspiration.",
          "isCorrect": false,
          "comment": "Un blocage de l'inspiration ne provoque pas une surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Une expiration insuffisante.",
          "isCorrect": true,
          "comment": "Une expiration insuffisante peut entraîner une surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Une brusque inspiration.",
          "isCorrect": false,
          "comment": "Une brusque inspiration n'est pas la cause principale de la surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la deuxième réponse est correcte pour décrire ce qui peut entraîner une surpression pulmonaire lors de la remontée en plongée."
      }
  ]
},


{
  "text": "Qu'est-ce que l'hyperventilation préalable à la plongée en apnée peut provoquer ?",
  "answers": [
      {
          "text": "Une insensibilité à la baisse de la quantité d'oxygène dans le sang.",
          "isCorrect": true,
          "comment": "L'hyperventilation préalable à la plongée en apnée peut provoquer une insensibilité à la baisse de la quantité d'oxygène dans le sang."
      },
      {
          "text": "Une augmentation de la sensibilité à l'oxygène.",
          "isCorrect": false,
          "comment": "L'hyperventilation ne conduit généralement pas à une augmentation de la sensibilité à l'oxygène."
      },
      {
          "text": "Une augmentation de la pression artérielle.",
          "isCorrect": false,
          "comment": "L'hyperventilation ne provoque pas nécessairement une augmentation de la pression artérielle."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la première réponse est correcte pour décrire ce que peut provoquer l'hyperventilation préalable à la plongée en apnée."
      }
  ]
},

{
  "text": "Quels signes peuvent indiquer la présence d'un accident de plongée ?",
  "answers": [
      {
          "text": "Des troubles de la parole.",
          "isCorrect": false,
          "comment": "Les troubles de la parole ne sont pas spécifiques aux accidents de plongée."
      },
      {
          "text": "Des troubles de la vision.",
          "isCorrect": false,
          "comment": "Les troubles de la vision ne sont pas spécifiques aux accidents de plongée."
      },
      {
          "text": "Des convulsions.",
          "isCorrect": false,
          "comment": "Les convulsions peuvent indiquer un accident de plongée, mais il existe d'autres signes également."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les troubles de la parole, de la vision et les convulsions peuvent tous indiquer la présence d'un accident de plongée."
      }
  ]
},



{
  "text": "Que doit-on faire en premier lors de l'action de secours pour une victime d'accident de plongée ?",
  "answers": [
      {
          "text": "Lui administrer de l'oxygène.",
          "isCorrect": false,
          "comment": "Administrer de l'oxygène peut être important, mais la première priorité est de sortir la victime de l'eau."
      },
      {
          "text": "Lui donner à boire.",
          "isCorrect": false,
          "comment": "Lui donner à boire n'est pas une mesure appropriée en cas d'accident de plongée."
      },
      {
          "text": "La sortir de l'eau.",
          "isCorrect": true,
          "comment": "La première action à entreprendre lors d'un accident de plongée est de sortir la victime de l'eau pour éviter l'asphyxie."
      },
      {
          "text": "Alerter les autorités.",
          "isCorrect": false,
          "comment": "Alerter les autorités est important, mais la première priorité est de sortir la victime de l'eau."
      }
  ]
},


{
  "text": "Quel est l'objectif principal de l'administration d'oxygène à une victime d'accident de plongée ?",
  "answers": [
      {
          "text": "Réduire la douleur.",
          "isCorrect": false,
          "comment": "L'administration d'oxygène vise principalement à limiter l'évolution et l'extension des lésions, pas à réduire la douleur."
      },
      {
          "text": "Améliorer la respiration.",
          "isCorrect": false,
          "comment": "Bien que l'oxygène puisse aider à améliorer la respiration, son objectif principal est différent."
      },
      {
          "text": "Éviter la formation de bulles de gaz.",
          "isCorrect": false,
          "comment": "L'oxygène ne vise pas spécifiquement à éviter la formation de bulles de gaz, mais plutôt à limiter les dommages causés par celles-ci."
      },
      {
          "text": "Limiter l'évolution et l'extension des lésions.",
          "isCorrect": true,
          "comment": "L'objectif principal de l'administration d'oxygène est de limiter l'évolution et l'extension des lésions chez une victime d'accident de plongée."
      }
  ]
},
{
  "text": "Quelle est la définition de la noyade ?",
  "answers": [
      {
          "text": "Une lésion traumatique due à un choc violent",
          "isCorrect": false,
          "comment": "Incorrect. La noyade ne se réfère pas à une lésion traumatique, mais à une détresse respiratoire due à l'immersion ou à la submersion."
      },
      {
          "text": "Une affection cutanée causée par une exposition prolongée à l'eau",
          "isCorrect": false,
          "comment": "Incorrect. La noyade ne concerne pas une affection cutanée, mais plutôt une détresse respiratoire due à l'immersion ou à la submersion."
      },
      {
          "text": "Une détresse respiratoire due à l'immersion ou à la submersion",
          "isCorrect": true,
          "comment": "Correct. La noyade est définie comme une détresse respiratoire due à l'immersion ou à la submersion dans l'eau."
      },
      {
          "text": "Une altération de la vision causée par une exposition à la lumière directe du soleil",
          "isCorrect": false,
          "comment": "Incorrect. Une altération de la vision due à l'exposition au soleil n'est pas la définition de la noyade, qui concerne plutôt une détresse respiratoire."
      }
  ]
},
{
  "text": "Quelle est la différence entre submersion et immersion ?",
  "answers": [
      {
          "text": "La submersion concerne le corps entier, tandis que l'immersion concerne uniquement le visage",
          "isCorrect": true,
          "comment": "Correct. La submersion implique que le corps entier est immergé, tandis que l'immersion se limite au visage."
      },
      {
          "text": "La submersion se produit dans l'eau, tandis que l'immersion se produit dans l'air",
          "isCorrect": false,
          "comment": "Incorrect. Les deux termes, submersion et immersion, impliquent une immersion dans l'eau, mais ils diffèrent par la partie du corps concernée."
      },
      {
          "text": "La submersion provoque l'arrêt cardiaque, tandis que l'immersion provoque l'hypothermie",
          "isCorrect": false,
          "comment": "Incorrect. La submersion et l'immersion ne sont pas associées à ces conséquences spécifiques."
      },
      {
          "text": "La submersion est une noyade mortelle, tandis que l'immersion peut être survivable",
          "isCorrect": false,
          "comment": "Incorrect. Toutes les submersions ne sont pas nécessairement mortelles, tout comme toutes les immersions ne sont pas nécessairement survivables."
      }
  ]
},
{
  "text": "Qu'est-ce qui peut causer une noyade ?",
  "answers": [
      {
          "text": "Une exposition prolongée au soleil",
          "isCorrect": false,
          "comment": "Incorrect. L'exposition au soleil ne cause pas directement la noyade."
      },
      {
          "text": "Une affection médicale telle qu'un accident vasculaire cérébral",
          "isCorrect": true,
          "comment": "Correct. Une affection médicale, comme un accident vasculaire cérébral, peut contribuer à la noyade en compromettant la capacité de la victime à respirer."
      },
      {
          "text": "Une consommation excessive d'aliments salés",
          "isCorrect": false,
          "comment": "Incorrect. La consommation d'aliments salés n'est pas directement liée à la noyade."
      },
      {
          "text": "Une exposition à des substances chimiques irritantes",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'exposition à des substances chimiques irritantes puisse être dangereuse, elle n'est pas une cause directe de noyade."
      }
  ]
},
{
  "text": "Qu'est-ce qui peut faciliter une noyade ?",
  "answers": [
      {
          "text": "Une alimentation équilibrée",
          "isCorrect": false,
          "comment": "Incorrect. L'alimentation équilibrée n'a pas d'effet direct sur la probabilité de noyade."
      },
      {
          "text": "Une hydratation adéquate",
          "isCorrect": false,
          "comment": "Incorrect. Bien qu'une hydratation adéquate soit importante pour la santé, elle n'est pas spécifiquement liée à la prévention de la noyade."
      },
      {
          "text": "L'hypothermie et l'hypoglycémie",
          "isCorrect": true,
          "comment": "Correct. L'hypothermie (baisse de la température corporelle) et l'hypoglycémie (baisse du taux de sucre dans le sang) peuvent rendre une personne plus vulnérable à la noyade."
      },
      {
          "text": "L'activité physique régulière",
          "isCorrect": false,
          "comment": "Incorrect. L'activité physique régulière est bénéfique pour la santé, mais elle n'a pas de lien direct avec la noyade."
      }
  ]
},
{
  "text": "Quels sont les risques et les conséquences de la noyade ?",
  "answers": [
      {
          "text": "Dommages cutanés et troubles digestifs",
          "isCorrect": false,
          "comment": "Incorrect. Les dommages cutanés et les troubles digestifs ne sont pas les principaux risques associés à la noyade."
      },
      {
          "text": "L'hypertension artérielle et les maladies cardiaques",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'hypertension artérielle et les maladies cardiaques puissent être des facteurs de risque, elles ne sont pas des conséquences directes de la noyade."
      },
      {
          "text": "L'hypoxie, la perte de connaissance, les régurgitations et l'arrêt cardiaque",
          "isCorrect": true,
          "comment": "Correct. Les principaux risques et conséquences de la noyade incluent l'hypoxie (manque d'oxygène), la perte de conscience, les régurgitations et l'arrêt cardiaque."
      },
      {
          "text": "La fatigue chronique et les troubles du sommeil",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la fatigue chronique et les troubles du sommeil puissent être des conséquences indirectes, ils ne sont pas des risques immédiats de la noyade."
      }
  ]
},
{
  "text": "Quel est le premier regard essentiel permettant d'évoquer la noyade ?",
  "answers": [
      {
          "text": "Observer la température de l'eau",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la température de l'eau puisse être importante dans certaines situations, elle n'est pas le premier regard essentiel pour évoquer la noyade."
      },
      {
          "text": "Examiner les vêtements de la victime",
          "isCorrect": false,
          "comment": "Incorrect. Les vêtements de la victime peuvent fournir des indices, mais ils ne sont pas le premier regard essentiel pour évoquer la noyade."
      },
      {
          "text": "Vérifier la présence de signes de fatigue",
          "isCorrect": false,
          "comment": "Incorrect. La fatigue peut être un symptôme, mais ce n'est pas le premier regard essentiel pour évoquer la noyade."
      },
      {
          "text": "Évaluer le temps passé dans l'eau, l'âge et les antécédents de la victime",
          "isCorrect": true,
          "comment": "Correct. Évaluer le temps passé dans l'eau, l'âge et les antécédents de la victime est essentiel pour évoquer la possibilité de noyade."
      }
  ]
},
{
  "text": "Quelle est la priorité lors de l'action de secours en cas de noyade ?",
  "answers": [
      {
          "text": "Identifier les témoins de l'incident",
          "isCorrect": false,
          "comment": "Incorrect. Identifier les témoins peut être important pour recueillir des informations, mais ce n'est pas la priorité immédiate lors de l'action de secours en cas de noyade."
      },
      {
          "text": "Assurer le dégagement immédiat et permanent de la victime du milieu aquatique",
          "isCorrect": true,
          "comment": "Correct. La priorité absolue lors de l'action de secours en cas de noyade est d'assurer le dégagement immédiat et permanent de la victime du milieu aquatique pour prévenir toute détérioration de son état."
      },
      {
          "text": "Vérifier la température de l'eau",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la température de l'eau puisse être importante, elle n'est pas la priorité immédiate lors de l'action de secours en cas de noyade."
      },
      {
          "text": "Examiner les vêtements de la victime",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les vêtements de la victime puissent fournir des informations, ils ne sont pas la priorité immédiate lors de l'action de secours en cas de noyade."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de noyade si la victime est en arrêt cardiaque ?",
  "answers": [
      {
          "text": "Attendre l'arrivée des secours sans intervenir",
          "isCorrect": false,
          "comment": "Incorrect. En cas d'arrêt cardiaque, une intervention immédiate est cruciale pour augmenter les chances de survie de la victime."
      },
      {
          "text": "Procéder immédiatement à des compressions thoraciques",
          "isCorrect": false,
          "comment": "Incorrect. Avant de débuter les compressions thoraciques, il est recommandé de réaliser d'abord cinq insufflations initiales chez une victime en arrêt cardiaque due à une noyade."
      },
      {
          "text": "Réaliser cinq insufflations initiales avant de débuter les compressions thoraciques",
          "isCorrect": true,
          "comment": "Correct. En cas d'arrêt cardiaque dû à une noyade, il est recommandé de commencer par réaliser cinq insufflations initiales avant de débuter les compressions thoraciques."
      },
      {
          "text": "Immobiliser la victime dans l'eau en attendant les secours spécialisés",
          "isCorrect": false,
          "comment": "Incorrect. Il est crucial de retirer la victime de l'eau et de commencer les premiers secours dès que possible en cas d'arrêt cardiaque."
      }
  ]
},
{
  "text": "Quels sont les gestes à effectuer pour assurer le sauvetage aquatique d'une victime de noyade ?",
  "answers": [
      {
          "text": "Entrer dans l'eau rapidement et seul",
          "isCorrect": false,
          "comment": "Incorrect. Entrer rapidement dans l'eau peut mettre en danger le sauveteur. Il est préférable d'utiliser un moyen d'aide au sauvetage."
      },
      {
          "text": "Utiliser un moyen d'aide au sauvetage et éviter de plonger tête la première",
          "isCorrect": true,
          "comment": "Correct. Il est recommandé d'utiliser un moyen d'aide au sauvetage tel qu'une bouée et d'éviter de plonger tête la première pour éviter les blessures."
      },
      {
          "text": "Ne pas parler à la victime pour éviter la panique",
          "isCorrect": false,
          "comment": "Incorrect. Il est important de communiquer avec la victime pour la rassurer et lui indiquer les actions entreprises."
      },
      {
          "text": "Plonger tête la première pour une meilleure propulsion",
          "isCorrect": false,
          "comment": "Incorrect. Plonger tête la première peut entraîner des blessures graves, surtout dans des eaux peu profondes ou inconnues."
      }
  ]
},
{
  "text": "Quelles sont les spécificités de la prise en charge d'une victime de noyade concernant la ventilation artificielle ?",
  "answers": [
      {
          "text": "Il faut réaliser des compressions thoraciques avant toute ventilation artificielle",
          "isCorrect": false,
          "comment": "Incorrect. En cas de noyade, il est recommandé de débuter par la ventilation artificielle avant les compressions thoraciques."
      },
      {
          "text": "Il est nécessaire d'attendre que la victime soit hors de l'eau pour débuter la ventilation artificielle",
          "isCorrect": false,
          "comment": "Incorrect. La ventilation artificielle doit être initiée dès que possible, idéalement pendant le dégagement de la victime de l'eau."
      },
      {
          "text": "La ventilation artificielle doit être réalisée dès que possible, idéalement pendant le dégagement de la victime de l'eau",
          "isCorrect": true,
          "comment": "Correct. La ventilation artificielle doit être débutée dès que possible, idéalement pendant le dégagement de la victime de l'eau, pour prévenir l'hypoxie."
      },
      {
          "text": "La ventilation artificielle est contre-indiquée chez les victimes de noyade",
          "isCorrect": false,
          "comment": "Incorrect. La ventilation artificielle est cruciale pour assurer l'apport d'oxygène chez les victimes de noyade en arrêt respiratoire."
      }
  ]
},
{
  "text": "Quel est le principal facteur conditionnant le devenir des victimes de noyade ?",
  "answers": [
      {
          "text": "La quantité d'eau ingérée pendant l'immersion",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'ingestion d'eau puisse être dangereuse, ce n'est pas le principal facteur conditionnant le devenir des victimes de noyade."
      },
      {
          "text": "La durée de l'hypoxie",
          "isCorrect": true,
          "comment": "Correct. La durée pendant laquelle la victime est privée d'oxygène (hypoxie) est le principal facteur conditionnant son devenir en cas de noyade."
      },
      {
          "text": "Le type de liquide dans lequel la victime a été immergée",
          "isCorrect": false,
          "comment": "Incorrect. Bien que le type de liquide puisse avoir un impact, la durée de l'hypoxie est un facteur plus critique pour le devenir des victimes de noyade."
      },
      {
          "text": "La température de l'eau",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la température de l'eau puisse influencer le devenir des victimes de noyade, la durée de l'hypoxie est un facteur plus déterminant."
      }
  ]
},
{
  "text": "Quels sont les gestes à éviter lors de la prise en charge d'une victime de noyade ?",
  "answers": [
      {
          "text": "Sécher prudemment la victime après son dégagement de l'eau",
          "isCorrect": false,
          "comment": "Incorrect. Il est important de sécher la victime pour éviter l'hypothermie, mais cela ne doit pas retarder les premiers secours."
      },
      {
          "text": "Utiliser des couvertures pour protéger la victime du vent",
          "isCorrect": false,
          "comment": "Incorrect. Utiliser des couvertures peut aider à maintenir la chaleur corporelle de la victime, ce qui est bénéfique dans certains cas de noyade."
      },
      {
          "text": "Effectuer des mobilisations intempestives lors du déshabillage de la victime",
          "isCorrect": true,
          "comment": "Correct. Il est important d'éviter les mobilisations intempestives qui pourraient aggraver les blessures ou le traumatisme de la victime."
      },
      {
          "text": "Surveiller attentivement la victime en continu",
          "isCorrect": false,
          "comment": "Incorrect. Surveiller la victime en continu est essentiel pour détecter tout changement dans son état et adapter les premiers secours en conséquence."
      }
  ]
},
{
  "text": "Quelle est la deuxième priorité lors de l'action de secours en cas de noyade ?",
  "answers": [
      {
          "text": "Compléter le bilan de la victime",
          "isCorrect": true,
          "comment": "Correct. Après avoir assuré le dégagement de la victime du milieu aquatique, il est important de compléter le bilan de la victime pour évaluer son état et déterminer les prochaines étapes des premiers secours."
      },
      {
          "text": "Surveiller attentivement la victime",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la surveillance de la victime soit importante, elle ne doit pas retarder les autres actions de secours, comme le dégagement de la victime de l'eau."
      },
      {
          "text": "Identifier les causes de l'incident",
          "isCorrect": false,
          "comment": "Incorrect. Bien qu'il soit important d'identifier les causes de l'incident pour prévenir d'autres accidents, cela ne doit pas retarder les premiers secours à la victime."
      },
      {
          "text": "Déshabiller la victime",
          "isCorrect": false,
          "comment": "Incorrect. Déshabiller la victime peut être nécessaire pour évaluer les blessures, mais ce n'est pas la priorité immédiate lors de l'action de secours en cas de noyade."
      }
  ]
},
{
  "text": "Pourquoi est-il important de sortir rapidement la victime de l'eau en cas d'arrêt cardiaque ?",
  "answers": [
      {
          "text": "Pour éviter que la victime n'attrape froid",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'hypothermie puisse être une préoccupation, la principale raison de sortir rapidement la victime de l'eau est d'initier les premiers secours pour augmenter ses chances de survie."
      },
      {
          "text": "Pour faciliter les compressions thoraciques",
          "isCorrect": false,
          "comment": "Incorrect. Bien que le dégagement de la victime de l'eau puisse faciliter les compressions thoraciques, la principale raison est d'initier rapidement les premiers secours."
      },
      {
          "text": "Pour limiter les mobilisations du cou",
          "isCorrect": false,
          "comment": "Incorrect. Bien que limiter les mobilisations du cou soit important pour éviter les lésions de la colonne vertébrale, ce n'est pas la principale raison de sortir rapidement la victime de l'eau."
      },
      {
          "text": "Pour augmenter les chances de survie de la victime",
          "isCorrect": true,
          "comment": "Correct. Sortir rapidement la victime de l'eau permet d'initier les premiers secours, ce qui est crucial pour augmenter ses chances de survie en cas d'arrêt cardiaque."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de noyade si la victime est consciente ?",
  "answers": [
      {
          "text": "Lui donner à boire immédiatement pour éviter la déshydratation",
          "isCorrect": false,
          "comment": "Incorrect. Il est déconseillé de donner à boire immédiatement à une victime de noyade, car cela pourrait aggraver son état. Il est préférable de lui fournir un environnement confortable et de surveiller attentivement son état."
      },
      {
          "text": "L'installer dans une position confortable à l'abri du vent",
          "isCorrect": true,
          "comment": "Correct. Lorsqu'une victime de noyade est consciente, il est important de l'installer dans une position confortable à l'abri du vent pour éviter l'hypothermie et de surveiller attentivement son état."
      },
      {
          "text": "Ne rien faire et attendre l'arrivée des secours",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'attente des secours soit importante, il est essentiel de fournir des premiers secours de base à la victime, comme la prévention de l'hypothermie et la surveillance de son état."
      },
      {
          "text": "Procéder immédiatement à des compressions thoraciques",
          "isCorrect": false,
          "comment": "Incorrect. Les compressions thoraciques ne sont pas nécessaires si la victime est consciente et respire normalement."
      }
  ]
},
{
  "text": "Quelle est la meilleure façon d'entrer dans l'eau pour secourir une victime de noyade ?",
  "answers": [
      {
          "text": "Plonger tête la première pour une meilleure propulsion",
          "isCorrect": false,
          "comment": "Incorrect. Plonger tête la première peut entraîner des blessures graves, surtout dans des eaux peu profondes ou inconnues."
      },
      {
          "text": "Utiliser un moyen d'aide au sauvetage comme une bouée",
          "isCorrect": true,
          "comment": "Correct. Utiliser un moyen d'aide au sauvetage comme une bouée est recommandé pour assurer la sécurité du sauveteur et de la victime."
      },
      {
          "text": "S'approcher discrètement de la victime pour éviter la panique",
          "isCorrect": false,
          "comment": "Incorrect. S'approcher discrètement peut être difficile et risqué, surtout si la victime est en détresse."
      },
      {
          "text": "Attendre que la victime nage jusqu'à vous pour la secourir",
          "isCorrect": false,
          "comment": "Incorrect. Attendre que la victime nage jusqu'à vous peut entraîner un retard dans le sauvetage, surtout si elle est en détresse."
      }
  ]
},
{
  "text": "Qu'est-ce qui peut provoquer une hypoxie chez une victime de noyade ?",
  "answers": [
      {
          "text": "Une réaction allergique aux produits chimiques présents dans l'eau",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les réactions allergiques puissent être graves, elles ne sont pas la principale cause d'hypoxie chez les victimes de noyade."
      },
      {
          "text": "Un arrêt volontaire de la respiration et un spasme laryngé",
          "isCorrect": true,
          "comment": "Correct. Un arrêt volontaire de la respiration et un spasme laryngé peuvent entraîner une privation d'oxygène (hypoxie) chez les victimes de noyade."
      },
      {
          "text": "Une exposition prolongée au soleil",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'exposition prolongée au soleil puisse entraîner des problèmes de santé, elle n'est pas la principale cause d'hypoxie chez les victimes de noyade."
      },
      {
          "text": "Une consommation excessive d'alcool",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la consommation d'alcool puisse aggraver certains risques liés à la noyade, elle n'est pas la principale cause d'hypoxie."
      }
  ]
},
{
  "text": "Quelles sont les conséquences de l'hypothermie chez une victime de noyade ?",
  "answers": [
      {
          "text": "Une augmentation de la température corporelle",
          "isCorrect": false,
          "comment": "Incorrect. L'hypothermie se caractérise par une diminution de la température corporelle, pas par une augmentation."
      },
      {
          "text": "Des frissons et une sensation de froid intense",
          "isCorrect": true,
          "comment": "Correct. L'hypothermie se manifeste généralement par des frissons, une sensation de froid intense et d'autres symptômes associés à une exposition prolongée au froid."
      },
      {
          "text": "Une accélération du rythme cardiaque",
          "isCorrect": false,
          "comment": "Incorrect. L'hypothermie peut entraîner une diminution du rythme cardiaque, pas une accélération."
      },
      {
          "text": "Une diminution de la pression artérielle",
          "isCorrect": false,
          "comment": "Incorrect. L'hypothermie peut entraîner une augmentation de la pression artérielle, pas une diminution."
      }
  ]
},
{
  "text": "Quels sont les principaux symptômes de la noyade chez une victime consciente ?",
  "answers": [
      {
          "text": "Des douleurs thoraciques et des difficultés à respirer",
          "isCorrect": false,
          "comment": "Incorrect. Ces symptômes peuvent être présents chez une victime de noyade, mais ils ne sont pas spécifiques à une victime consciente."
      },
      {
          "text": "Un état de panique et une confusion mentale",
          "isCorrect": false,
          "comment": "Incorrect. Ces symptômes peuvent survenir chez une victime de noyade, mais ils ne sont pas spécifiques à une victime consciente."
      },
      {
          "text": "Une fatigue extrême et des douleurs musculaires",
          "isCorrect": false,
          "comment": "Incorrect. Ces symptômes peuvent être présents chez une victime de noyade, mais ils ne sont pas spécifiques à une victime consciente."
      },
      {
          "text": "Une toux persistante et des signes de détresse respiratoire",
          "isCorrect": true,
          "comment": "Correct. Une toux persistante et des signes de détresse respiratoire sont des symptômes courants de la noyade chez une victime consciente."
      }
  ]
},
{
  "text": "Quel est le geste essentiel à réaliser en premier lors de la prise en charge d'une victime de noyade ?",
  "answers": [
      {
          "text": "Appliquer immédiatement des compressions thoraciques",
          "isCorrect": false,
          "comment": "Incorrect. Les compressions thoraciques ne sont nécessaires que si la victime est en arrêt cardiaque."
      },
      {
          "text": "Identifier les témoins de l'incident",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'identification des témoins soit importante, ce n'est pas la première priorité lors de la prise en charge d'une victime de noyade."
      },
      {
          "text": "Assurer le dégagement immédiat et permanent de la victime du milieu aquatique",
          "isCorrect": true,
          "comment": "Correct. La première étape consiste à sortir la victime de l'eau pour prévenir toute détérioration supplémentaire de son état."
      },
      {
          "text": "Examiner les vêtements de la victime",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'examen des vêtements puisse fournir des informations sur l'incident, ce n'est pas la première priorité lors de la prise en charge d'une victime de noyade."
      }
  ]
},

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
