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
    text: "Qu’elle est la défnition d'une gelure ?",
    answers: [
      { text: "Un saignement qui ne s'arrête pas", isCorrect: false, comment: "Ce n'est pas correct. Une gelure est une lésion grave de la peau liée au froid." },
      { text: "Une lésion grave de la peau liée au froid", isCorrect: true, comment: "Une gelure est en effet une lésion de la peau causée par le froid." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." }
    ]
  },
  {
    text: "Dans quelle(s) condition(s) surviennent les gelures ?",
    answers: [
      { text: "Lors d’une exposition prolongée dans un milieu froid, en dessous de 0°C", isCorrect: true },
      { text: "Lors d’une exposition de 5 min dans un milieu froid -10°C", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false }
    ]
  },
  {
    text: "Combien de degré de gelure existe-il ?",
    answers: [
      { text: "3 sachant que dans le cas le plus grave il y a un risque d’amputation", isCorrect: false },
      { text: "4 et l’apparition des 1er cloques s’effectue au 3eme degré", isCorrect: true },
      { text: "4 et l’apparition des cloques sanglantes se manifeste au 3eme degré", isCorrect: false },
      { text: "4 et l’amputation est irréversible dans le pire cas", isCorrect: false }
    ]
  },
  {
    text: "Sous quelles conditions pouvons-nous plonger les gelures dans une bassine d’eau à 37-39°C ?",
    answers: [
      { text: "Uniquement sous 10h", isCorrect: false },
      { text: "Uniquement sous 24h", isCorrect: false },
      { text: "S’il n’y a pas de risque de réexposition au froid", isCorrect: true },
      { text: "Pas plus de 20min immergées", isCorrect: false }
    ]
  },
  {
      text: "Pourquoi est-il important de repérer la présence d'une poche d'air lors du dégagement de la tête de la victime ensevelie ?",
      answers: [
          {
              text: "Pour décider si la victime doit être évacuée rapidement",
              isCorrect: false,
              comment: "L'évaluation de la poche d'air est importante pour adapter la conduite à tenir, mais cela ne détermine pas nécessairement la nécessité d'une évacuation rapide."
          },
          {
              text: "Pour évaluer l'ampleur des lésions traumatiques",
              isCorrect: false,
              comment: "Bien que l'évaluation des lésions soit importante, la présence d'une poche d'air est plus pertinente pour fournir une ventilation efficace."
          },
          {
              text: "Pour déterminer si la victime est encore consciente",
              isCorrect: false,
              comment: "La présence d'une poche d'air n'est pas nécessairement liée à la conscience de la victime. Elle est importante pour fournir de l'oxygène si nécessaire."
          },
          {
              text: "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
              isCorrect: true,
              comment: "Repérer une poche d'air permet d'adapter la prise en charge de la victime et de fournir de l'oxygène pour prévenir l'asphyxie."
          }
      ]
  },
  {
      text: "Quel est l'un des mécanismes de traumatismes subis par une victime ensevelie dans une avalanche ?",
      answers: [
          {
              text: "L'écrasement par la neige compacte",
              isCorrect: false,
              comment: "L'écrasement est un mécanisme de traumatisme, mais les chocs contre des obstacles comme les rochers ou les arbres sont également fréquents."
          },
          {
              text: "La déshydratation due à l'exposition prolongée",
              isCorrect: false,
              comment: "La déshydratation peut être un problème, mais les traumatismes physiques sont plus immédiats et graves dans les premières minutes après l'avalanche."
          },
          {
              text: "Les brûlures causées par le frottement avec la neige",
              isCorrect: false,
              comment: "Les brûlures sont peu probables dans une avalanche. Les traumatismes sont généralement dus à des chocs contre des obstacles ou à l'asphyxie."
          },
          {
              text: "Les chocs directs contre les rochers ou les arbres",
              isCorrect: true,
              comment: "Les chocs contre des obstacles solides comme les rochers ou les arbres sont l'un des principaux mécanismes de traumatismes dans les avalanches."
          }
      ]
  },
  {
    "text": "Qu'est-ce que l'électrisation ?",
    "answers": [
        {
            "text": "L'ensemble des lésions provoquées par le passage d'un courant électrique à travers le corps.",
            "isCorrect": true,
            "comment": "L'électrisation désigne en effet l'ensemble des lésions causées par le passage du courant électrique à travers le corps."
        },
        {
            "text": "Un accident lié à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "Ce type d'accident est différent et n'est pas spécifiquement appelé électrisation."
        },
        {
            "text": "L'effet direct du courant électrique lorsqu'il traverse les tissus.",
            "isCorrect": false,
            "comment": "C'est une partie de l'électrisation, mais pas sa définition complète."
        },
        {
            "text": "Toutes les réponses précédentes sont correctes.",
            "isCorrect": false,
            "comment": "Seule la première réponse est correcte pour définir l'électrisation."
        }
    ]
},

{
    "text": "Qu'est-ce que l'électrocution ?",
    "answers": [
        {
            "text": "Une électrisation mortelle.",
            "isCorrect": true,
            "comment": "L'électrocution désigne une électrisation mortelle."
        },
        {
            "text": "Une électrisation temporaire.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas temporaire, c'est une condition mortelle."
        },
        {
            "text": "Une électrisation due à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "L'électrocution ne se limite pas à la production d'un arc électrique."
        },
        {
            "text": "Une électrisation provoquée par un courant continu.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas spécifiquement liée à un type particulier de courant électrique."
        }
    ]
},

{
    "text": "Quel est le nombre estimé d'accidents mortels d'origine électrique en France chaque année ?",
    "answers": [
        {
            "text": "Environ 50",
            "isCorrect": false,
            "comment": "Ce nombre est plus élevé que cela."
        },
        {
            "text": "Environ 200",
            "isCorrect": false,
            "comment": "Ce nombre est encore plus élevé."
        },
        {
            "text": "Environ 1000",
            "isCorrect": false,
            "comment": "Ce nombre est excessivement élevé pour les accidents électriques mortels en France."
        },
        {
            "text": "Environ 100",
            "isCorrect": true,
            "comment": "Environ 100 accidents mortels d'origine électrique sont estimés chaque année en France."
        }
    ]
},

{
    "text": "Quelle est la barrière la plus résistante face au courant électrique ?",
    "answers": [
        {
            "text": "Les nerfs.",
            "isCorrect": false,
            "comment": "Les nerfs ne sont pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "Les vaisseaux sanguins.",
            "isCorrect": false,
            "comment": "Les vaisseaux sanguins ne constituent pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "La peau.",
            "isCorrect": true,
            "comment": "La peau est la barrière la plus résistante face au courant électrique."
        },
        {
            "text": "Le liquide amniotique.",
            "isCorrect": false,
            "comment": "Le liquide amniotique n'est pas une barrière face au courant électrique chez une personne enceinte."
        }
    ]
},

{
    "text": "À quelle intensité de courant électrique commence-t-on à ressentir des picotements ?",
    "answers": [
        {
            "text": "1 mA",
            "isCorrect": true,
            "comment": "À partir d'environ 1 mA, on peut commencer à ressentir des picotements dus au courant électrique."
        },
        {
            "text": "10 mA",
            "isCorrect": false,
            "comment": "Cette intensité est plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "30 mA",
            "isCorrect": false,
            "comment": "Cette intensité est encore plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "100 mA",
            "isCorrect": false,
            "comment": "Cette intensité est beaucoup plus élevée que celle à laquelle on commence à ressentir des picotements."
        }
    ]
},

{
    "text": "Quels types d'accidents électriques peuvent survenir en France ?",
    "answers": [
        {
            "text": "Uniquement des accidents domestiques.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents domestiques."
        },
        {
            "text": "Accidents du travail, domestiques, de loisirs, dus à des conduites à risque et foudroiement.",
            "isCorrect": true,
            "comment": "Les accidents électriques en France peuvent inclure des accidents du travail, domestiques, de loisirs, dus à des conduites à risque et le foudroiement."
        },
        {
            "text": "Uniquement des accidents liés à des conduites à risque.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents liés à des conduites à risque."
        },
        {
            "text": "Uniquement des accidents de loisirs.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents de loisirs."
        }
    ]
},

{
    "text": "Qu'est-ce que l'action de secours doit permettre lors d'un accident électrique ?",
    "answers": [
        {
            "text": "Réparer les câbles endommagés.",
            "isCorrect": false,
            "comment": "La réparation des câbles endommagés est une tâche pour les professionnels de l'électricité, pas pour les secouristes."
        },
        {
            "text": "Prendre des photos des blessures.",
            "isCorrect": false,
            "comment": "Prendre des photos des blessures peut être utile à des fins médicales, mais ce n'est pas l'objectif principal de l'action de secours lors d'un accident électrique."
        },
        {
            "text": "Obtenir un avis médical, réaliser les gestes de secours adaptés et prendre en charge les brûlures.",
            "isCorrect": true,
            "comment": "L'action de secours lors d'un accident électrique doit permettre d'obtenir un avis médical, de réaliser les gestes de secours adaptés et de prendre en charge les brûlures."
        },
        {
            "text": "Aucune des réponses précédentes.",
            "isCorrect": false,
            "comment": "La dernière option est incorrecte car l'action de secours doit comprendre plusieurs mesures pour aider la victime."
        }
    ]
},


{
    "text": "Que doit faire un intervenant secouriste lorsqu'une victime est en contact avec un conducteur endommagé ?",
    "answers": [
        {
            "text": "S'approcher immédiatement de la victime.",
            "isCorrect": false,
            "comment": "S'approcher immédiatement de la victime peut mettre en danger l'intervenant lui-même en cas de danger électrique."
        },
        {
            "text": "Couper le courant si possible.",
            "isCorrect": true,
            "comment": "La première action à entreprendre est de couper le courant si cela est possible pour sécuriser la zone et éviter de nouvelles victimes."
        },
        {
            "text": "Toucher la victime pour vérifier si elle est consciente.",
            "isCorrect": false,
            "comment": "Toucher la victime sans avoir sécurisé la zone peut être dangereux en cas de danger électrique."
        },
        {
            "text": "Prendre des photos de la scène.",
            "isCorrect": false,
            "comment": "Prendre des photos de la scène peut être utile à des fins d'enquête ou de documentation, mais cela ne doit pas être la priorité lorsqu'une victime est en contact avec un conducteur endommagé."
        }
    ]
},

{
  "text": "Quelles sont les conséquences des accidents barotraumatiques ?",
  "answers": [
      {
          "text": "Des douleurs au niveau des articulations.",
          "isCorrect": false,
          "comment": "Les douleurs au niveau des articulations ne sont pas une conséquence typique des accidents barotraumatiques."
      },
      {
          "text": "Des troubles neurologiques.",
          "isCorrect": false,
          "comment": "Les troubles neurologiques peuvent être causés par certains types d'accidents de plongée, mais ils ne sont pas spécifiquement associés aux accidents barotraumatiques."
      },
      {
          "text": "Des bulles de gaz dans les vaisseaux pulmonaires.",
          "isCorrect": false,
          "comment": "Les bulles de gaz dans les vaisseaux pulmonaires peuvent être une conséquence des accidents de décompression, mais pas spécifiquement des accidents barotraumatiques."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des accidents barotraumatiques peuvent inclure des douleurs articulaires, des troubles neurologiques et des bulles de gaz dans les vaisseaux pulmonaires."
      }
  ]
},


{
  "text": "Quelles sont les conséquences des accidents de désaturation ?",
  "answers": [
      {
          "text": "Des douleurs musculaires.",
          "isCorrect": false,
          "comment": "Les douleurs musculaires ne sont pas une conséquence typique des accidents de désaturation."
      },
      {
          "text": "Des troubles de la conscience.",
          "isCorrect": false,
          "comment": "Les troubles de la conscience peuvent être associés à certains types d'accidents de plongée, mais pas spécifiquement aux accidents de désaturation."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": false,
          "comment": "C'est une réponse similaire à la précédente."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des accidents de désaturation peuvent inclure des troubles de la conscience et des perturbations de l'état de conscience."
      }
  ]
},

{
  "text": "Quelles sont les conséquences principales des concentrations toxiques des gaz ?",
  "answers": [
      {
          "text": "Des troubles cardiaques.",
          "isCorrect": false,
          "comment": "Les troubles cardiaques ne sont pas une conséquence principale des concentrations toxiques des gaz."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": false,
          "comment": "Les perturbations de l'état de conscience peuvent être causées par certains types d'accidents de plongée, mais pas spécifiquement par les concentrations toxiques des gaz."
      },
      {
          "text": "Des troubles visuels.",
          "isCorrect": false,
          "comment": "Les troubles visuels peuvent être associés à certains types d'accidents de plongée, mais pas spécifiquement aux concentrations toxiques des gaz."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les conséquences des concentrations toxiques des gaz peuvent inclure des perturbations de l'état de conscience et des troubles visuels."
      }
  ]
},

{
  "text": "Quelles sont les conséquences principales des concentrations toxiques des gaz ?",
  "answers": [
      {
          "text": "Des troubles cardiaques.",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les concentrations toxiques des gaz puissent avoir un impact sur le système cardiovasculaire, ce ne sont pas les conséquences principales."
      },
      {
          "text": "Des perturbations de l'état de conscience.",
          "isCorrect": true,
          "comment": "Correct. Les concentrations toxiques des gaz peuvent entraîner des altérations de l'état de conscience, allant de la confusion à la perte de conscience."
      },
      {
          "text": "Des troubles visuels.",
          "isCorrect": false,
          "comment": "Incorrect. Les troubles visuels peuvent survenir avec certaines concentrations toxiques des gaz, mais ce ne sont pas les conséquences principales."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Incorrect. Seules les perturbations de l'état de conscience sont les conséquences principales des concentrations toxiques des gaz."
      }
  ]
},
{
  "text": "Quelle est la définition d'une intoxication ?",
  "answers": [
      {
          "text": "Une inflammation des voies respiratoires",
          "isCorrect": false,
          "comment": "Incorrect. Une intoxication n'est pas une inflammation des voies respiratoires, mais un trouble causé par la pénétration d'une substance toxique dans l'organisme."
      },
      {
          "text": "Un trouble causé par la pénétration d'une substance toxique dans l'organisme",
          "isCorrect": true,
          "comment": "Correct. Une intoxication est un trouble causé par la pénétration d'une substance toxique dans l'organisme, pouvant entraîner divers symptômes et complications."
      },
      {
          "text": "Une affection cutanée due à une exposition prolongée au soleil",
          "isCorrect": false,
          "comment": "Incorrect. Une intoxication n'est pas une affection cutanée, mais un trouble causé par l'ingestion, l'inhalation, ou le contact avec une substance toxique."
      },
      {
          "text": "Une réaction allergique aux aliments",
          "isCorrect": false,
          "comment": "Incorrect. Une intoxication n'est pas une réaction allergique, mais un trouble causé par la pénétration d'une substance toxique dans l'organisme."
      }
  ]
},
{
  "text": "Quelles sont les différentes voies par lesquelles un poison peut pénétrer dans l'organisme ?",
  "answers": [
      {
          "text": "Digestion, inhalation, absorption, émission",
          "isCorrect": false,
          "comment": "Incorrect. La voie d'émission n'est pas une voie par laquelle un poison peut pénétrer dans l'organisme. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      },
      {
          "text": "Digestion, inhalation, piqûre, immersion",
          "isCorrect": false,
          "comment": "Incorrect. L'immersion n'est pas une voie courante par laquelle un poison peut pénétrer dans l'organisme. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      },
      {
          "text": "Ingestion, injection, respiration, absorption",
          "isCorrect": true,
          "comment": "Correct. Les principales voies par lesquelles un poison peut pénétrer dans l'organisme sont l'ingestion (digestion), l'injection, la respiration (inhalation) et l'absorption à travers la peau ou les muqueuses."
      },
      {
          "text": "Ingestion, inspiration, injection, érosion",
          "isCorrect": false,
          "comment": "Incorrect. L'inspiration ne se réfère pas à l'inhalation de substances toxiques. Les voies courantes sont l'ingestion, l'inhalation, l'absorption et l'injection."
      }
  ]
},
{
  "text": "Qu'est-ce qui peut également causer des intoxications?",
  "answers": [
      {
          "text": "Les accidents de la route",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les accidents de la route puissent causer des blessures graves, ils ne sont pas la cause directe des intoxications, qui sont dues à l'ingestion, l'inhalation ou l'absorption de substances toxiques."
      },
      {
          "text": "Les infections bactériennes",
          "isCorrect": false,
          "comment": "Incorrect. Les infections bactériennes sont causées par des agents pathogènes, pas par des substances toxiques. Les intoxications sont généralement dues à l'exposition à des substances toxiques."
      },
      {
          "text": "Les drogues, les médicaments et l'alcool",
          "isCorrect": true,
          "comment": "Correct. Les intoxications peuvent également être causées par la consommation excessive ou inappropriée de drogues, de médicaments ou d'alcool, ce qui peut entraîner des effets toxiques sur l'organisme."
      },
      {
          "text": "Les blessures sportives",
          "isCorrect": false,
          "comment": "Incorrect. Les blessures sportives sont des traumatismes physiques causés par des activités sportives. Elles ne sont pas considérées comme des intoxications, qui sont dues à l'exposition à des substances toxiques."
      }
  ]
},
{
  "text": "Quels sont les signes caractéristiques de surdosage ou d'intoxication aux opiacés ou aux opioïdes ?",
  "answers": [
      {
          "text": "Pâleur de la peau et sueurs froides",
          "isCorrect": false,
          "comment": "Incorrect. Bien que ces symptômes puissent être présents dans certains cas d'intoxication, les signes caractéristiques d'un surdosage aux opiacés ou aux opioïdes incluent le myosis (réduction de la taille de la pupille) et la dépression respiratoire."
      },
      {
          "text": "Myosis et dépression respiratoire",
          "isCorrect": true,
          "comment": "Correct. Les signes caractéristiques d'un surdosage ou d'une intoxication aux opiacés ou aux opioïdes incluent le myosis (réduction de la taille de la pupille) et la dépression respiratoire, qui peuvent être des indicateurs d'une intoxication grave."
      },
      {
          "text": "Augmentation de la fréquence cardiaque et agitation",
          "isCorrect": false,
          "comment": "Incorrect. Une augmentation de la fréquence cardiaque et de l'agitation ne sont généralement pas associées à un surdosage aux opiacés ou aux opioïdes. Ces symptômes peuvent plutôt être observés dans d'autres types d'intoxications ou de troubles."
      },
      {
          "text": "Fièvre et tachycardie",
          "isCorrect": false,
          "comment": "Incorrect. La fièvre et la tachycardie ne sont pas des signes caractéristiques d'un surdosage aux opiacés ou aux opioïdes. Les signes typiques incluent le myosis et la dépression respiratoire."
      }
  ]
},
{
  "text": "Quelle est la recommandation en cas d'intoxication aux opiacés avec dépression respiratoire ?",
  "answers": [
      {
          "text": "Administrer de l'oxygène en inhalation",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'administration d'oxygène puisse être nécessaire dans certains cas d'intoxication, la recommandation principale en cas d'intoxication aux opiacés avec dépression respiratoire est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de la morphine",
          "isCorrect": false,
          "comment": "Incorrect. L'administration de morphine n'est pas appropriée en cas d'intoxication aux opiacés, car cela aggraverait la dépression respiratoire. La recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de l'alprazolam",
          "isCorrect": false,
          "comment": "Incorrect. L'alprazolam est un médicament utilisé pour traiter les troubles anxieux et ne convient pas pour traiter une intoxication aux opiacés. La recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes."
      },
      {
          "text": "Administrer de la naloxone par pulvérisation intranasale",
          "isCorrect": true,
          "comment": "Correct. En cas d'intoxication aux opiacés avec dépression respiratoire, la recommandation principale est d'administrer de la naloxone, un antagoniste des opioïdes, par pulvérisation intranasale pour inverser les effets des opiacés et restaurer la respiration."
      }
  ]
},
{
  "text": "Que faut-il faire en cas de projection d'un toxique sur la peau provoquant une brûlure ?",
  "answers": [
      {
          "text": "Laver abondamment avec de l'eau froide",
          "isCorrect": false,
          "comment": "Incorrect. Bien que le lavage abondant à l'eau soit une mesure initiale importante, en cas de projection d'un toxique provoquant une brûlure, la conduite à tenir est d'adopter la conduite à tenir face à une brûlure chimique, ce qui peut impliquer d'autres mesures spécifiques."
      },
      {
          "text": "Ne rien faire et attendre l'intervention des secours",
          "isCorrect": false,
          "comment": "Incorrect. Il est important d'agir rapidement en cas de projection d'un toxique provoquant une brûlure. Attendre l'intervention des secours sans prendre de mesures immédiates peut aggraver la situation."
      },
      {
          "text": "Appliquer une crème hydratante",
          "isCorrect": false,
          "comment": "Incorrect. L'application d'une crème hydratante n'est pas la mesure appropriée en cas de projection d'un toxique provoquant une brûlure. La conduite à tenir dépend du type de substance impliquée et peut nécessiter des mesures spécifiques."
      },
      {
          "text": "Adopter la conduite à tenir face à une brûlure chimique",
          "isCorrect": true,
          "comment": "Correct. En cas de projection d'un toxique provoquant une brûlure, il est essentiel d'adopter la conduite à tenir face à une brûlure chimique, ce qui peut inclure le lavage abondant à l'eau, l'élimination des vêtements contaminés et l'application de mesures spécifiques en fonction du toxique."
      }
  ]
},
{
  "text": "Quelles actions doivent être entreprises en cas d'intoxication en environnement toxique ?",
  "answers": [
      {
          "text": "Se placer au contact direct du toxique pour évaluer la gravité de la situation",
          "isCorrect": false,
          "comment": "Incorrect. Se placer au contact direct du toxique peut mettre en danger la santé de la personne qui intervient. La priorité est de se retirer rapidement de l'environnement toxique et de protéger la victime."
      },
      {
          "text": "Se retirer rapidement de l'environnement toxique et protéger la victime",
          "isCorrect": true,
          "comment": "Correct. En cas d'intoxication en environnement toxique, la première action à entreprendre est de se retirer rapidement de l'environnement toxique pour éviter toute exposition supplémentaire, puis de protéger la victime en lui fournissant une assistance médicale si nécessaire."
      },
      {
          "text": "Inhaler volontairement le toxique pour développer une immunité",
          "isCorrect": false,
          "comment": "Incorrect. Inhaler volontairement le toxique est extrêmement dangereux et peut entraîner des dommages graves pour la santé. La priorité est de se retirer de l'environnement toxique et de chercher une assistance médicale."
      },
      {
          "text": "Ignorer l'environnement toxique et se concentrer uniquement sur la victime",
          "isCorrect": false,
          "comment": "Incorrect. Ignorer l'environnement toxique peut mettre en danger la sécurité de la personne qui intervient. Il est essentiel de se retirer de l'environnement toxique tout en protégeant la victime."
      }
  ]
},
{
  "text": "Quels signes peuvent être recherchés lors de l'examen d'une victime d'intoxication pour déterminer la nature du toxique ?",
  "answers": [
      {
          "text": "Présence de pansements sur la peau",
          "isCorrect": false,
          "comment": "Incorrect. La présence de pansements sur la peau ne fournit pas d'indications sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Présence de cicatrices",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la présence de cicatrices puisse indiquer des blessures antérieures, cela ne fournit pas d'informations spécifiques sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Présence de boîtes de médicaments vides",
          "isCorrect": true,
          "comment": "Correct. L'examen de la victime d'intoxication peut inclure la recherche de boîtes de médicaments vides ou d'autres emballages de substances toxiques, ce qui peut aider à identifier la nature du toxique et à déterminer le traitement approprié."
      },
      {
          "text": "Présence de vêtements de protection",
          "isCorrect": false,
          "comment": "Incorrect. La présence de vêtements de protection ne fournit pas d'indications directes sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      }
  ]
},
{
  "text": "Quelle est la priorité lors de l'action de secours en cas d'intoxication ?",
  "answers": [
      {
          "text": "Identifier les témoins de l'incident",
          "isCorrect": false,
          "comment": "Incorrect. Bien qu'il soit important de recueillir des informations sur les circonstances de l'intoxication, la priorité lors de l'action de secours est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Demander un avis médical",
          "isCorrect": false,
          "comment": "Incorrect. Demander un avis médical est une étape importante, mais la priorité lors de l'action de secours en cas d'intoxication est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Lutter contre une détresse vitale",
          "isCorrect": true,
          "comment": "Correct. La priorité lors de l'action de secours en cas d'intoxication est de lutter contre toute détresse vitale de la victime, telle que l'arrêt respiratoire ou cardiaque, et de fournir une assistance médicale immédiate si nécessaire."
      },
      {
          "text": "Examiner les emballages des produits en cause",
          "isCorrect": false,
          "comment": "Incorrect. Bien qu'il soit important de recueillir des informations sur les substances ingérées ou exposées, la priorité lors de l'action de secours est de lutter contre toute détresse vitale de la victime et de fournir une assistance médicale immédiate si nécessaire."
      }
  ]
},
{
  "text": "Quel est le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique ?",
  "answers": [
      {
          "text": "Observer le ciel pour détecter des signes de pluie acide",
          "isCorrect": false,
          "comment": "Incorrect. Observer le ciel pour détecter des signes de pluie acide est important dans certaines situations environnementales, mais cela ne constitue pas le premier regard essentiel lorsqu'on suspecte une intoxication. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Examiner attentivement les plantes environnantes",
          "isCorrect": false,
          "comment": "Incorrect. Bien que l'examen des plantes environnantes puisse être pertinent dans certains cas d'intoxication, ce n'est pas le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Vérifier la présence de flacons suspects",
          "isCorrect": false,
          "comment": "Incorrect. Bien que la vérification de la présence de flacons suspects puisse être pertinente dans certains contextes, ce n'est pas le premier regard essentiel lorsqu'on suspecte une intoxication due à un environnement toxique. Le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable."
      },
      {
          "text": "Identifier la présence d'un nuage toxique ou d'une odeur désagréable",
          "isCorrect": true,
          "comment": "Correct. Lorsqu'on suspecte une intoxication due à un environnement toxique, le premier regard essentiel est d'identifier la présence d'un nuage toxique ou d'une odeur désagréable, ce qui peut indiquer la présence de substances toxiques dans l'air."
      }
  ]
},
{
  "text": "Quels éléments doivent être pris en compte lors de l'examen d'une victime d'intoxication pour déterminer la nature du toxique ?",
  "answers": [
      {
          "text": "Les tatouages sur le corps de la victime",
          "isCorrect": false,
          "comment": "Incorrect. Les tatouages sur le corps de la victime ne fournissent pas d'indications directes sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Les bijoux portés par la victime",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les bijoux portés par la victime puissent être pertinents pour l'identification de la victime, ils ne fournissent pas d'indications sur la nature du toxique. Pour déterminer la nature du toxique, il est plus pertinent de rechercher des indices tels que la présence de boîtes de médicaments vides, des symptômes spécifiques et des antécédents médicaux."
      },
      {
          "text": "Les circonstances de survenue, la nature du toxique, la dose supposée absorbée et l'heure de l'ingestion",
          "isCorrect": true,
          "comment": "Correct. Lors de l'examen d'une victime d'intoxication, il est important de prendre en compte les circonstances de survenue, la nature du toxique, la dose supposée absorbée et l'heure de l'ingestion, car ces informations peuvent aider à déterminer le traitement approprié et à prévenir les complications."
      },
      {
          "text": "Les vêtements portés par la victime au moment de l'incident",
          "isCorrect": false,
          "comment": "Incorrect. Bien que les vêtements portés par la victime puissent fournir des indices sur la nature du toxique, ils ne sont pas aussi significatifs que d'autres éléments tels que les circonstances de survenue, la dose supposée absorbée et l'heure de l'ingestion."
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
