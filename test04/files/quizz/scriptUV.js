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
        "text": "Qu'est-ce qui caractérise un arrêt cardiaque chez l'adulte ?",
        "answers": [
            {
                "text": "Une augmentation soudaine de la pression artérielle.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une absence de tout symptôme.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une interruption de toute activité mécanique efficace du cœur.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une diminution de la fréquence cardiaque.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]

    },
    {
        "text": "Quelle est l'une des causes possibles d'un arrêt cardiaque chez l'adulte ?",
        "answers": [
            {
                "text": "Une abondance d'oxygène dans le sang.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une augmentation de la circulation sanguine.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Un infarctus du myocarde.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une augmentation du rythme cardiaque.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la principale cause d'arrêt cardiaque chez l'enfant et le nourrisson ?",
        "answers": [
            {
                "text": "Une origine cardiaque.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Un manque d'oxygène.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Une intoxication alimentaire.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Une augmentation soudaine de la pression artérielle.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quels sont les risques si aucun geste de secours n'est réalisé lors d'un arrêt cardiaque ?",
        "answers": [
            {
                "text": "Des lésions rénales.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des lésions hépatiques.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Des lésions cérébrales.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Des lésions pulmonaires.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la première étape de l'action de secours en cas d'arrêt cardiaque ?",
        "answers": [
            {
                "text": "Guider la victime pour pratiquer elle-même une réanimation cardio-pulmonaire.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Reconnaître les signes annonciateurs ou l'arrêt cardiaque.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Attendre les secours médicalisés sans intervenir.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Faire boire de l'eau à la victime.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },

    {
        "text": "Combien de compressions thoraciques doivent être effectuées lors d'une RCP chez l'adulte par cycle ?",
        "answers": [
            {
                "text": "20 compressions thoraciques.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "30 compressions thoraciques.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "40 compressions thoraciques.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "50 compressions thoraciques.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "À quel moment doit-on mettre en œuvre le DAE lors d'un arrêt cardiaque chez l'adulte ?",
        "answers": [
            {
                "text": "Après 5 minutes de RCP.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Le plus tôt possible.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Après avoir vérifié le pouls carotidien.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Après avoir administré de l'oxygène par insufflation.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Quelle est la fréquence des insufflations chez l'adulte en cas d'arrêt cardiaque ?",
        "answers": [
            {
                "text": "5 à 10 insufflations par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "10 à 15 insufflations par minute.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "15 à 20 insufflations par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "20 à 25 insufflations par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    {
        "text": "Que doit faire le secouriste si la victime reprend une ventilation normale pendant la RCP ?",
        "answers": [
            {
                "text": "Cesser les compressions thoraciques et la ventilation.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Continuer les compressions thoraciques et la ventilation.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Mettre en place une canule oropharyngée.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Administrer de l'oxygène par insufflation.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },
    
    {
        "text": "Donnez une cause de détresse circulatoire ?",
        "answers": [
            
            {
                "text": "Un traumatisme crânien.",
                "isCorrect": false,
                "comment": "Et non c'était une réaction allergique grave."
            },
            {
                "text": "Une insuffisance respiratoire.",
                "isCorrect": false,
                "comment": "Et non c'était une réaction allergique grave."
            },
            {
                "text": "Une altération de la fonction musculaire.",
                "isCorrect": false,
                "comment": "Et non c'était une réaction allergique grave."
            },
            {
                "text": "Une réaction allergique grave.",
                "isCorrect": true,
                "comment": "C'est bien ça !"
            },
        ]
    },
    
    {
        "text": "Quelle est la fréquence cardiaque qui peut indiquer une détresse circulatoire chez une personne au repos ?",
        "answers": [
            {
                "text": "Supérieure à 60 battements par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Supérieure à 90 battements par minute.",
                "isCorrect": true,
                "comment": "Réponse correcte."
            },
            {
                "text": "Inférieure à 40 battements par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            },
            {
                "text": "Inférieure à 120 battements par minute.",
                "isCorrect": false,
                "comment": "Ce n'est pas la bonne réponse."
            }
        ]
    },

{
    "text": "Dans quel contexte la mise en place d'une canule oropharyngée est recommandée ?",
    "answers": [
        {
            "text": "Lorsque la victime est consciente mais a des difficultés respiratoires",
            "isCorrect": false,
            "comment": "Ce n'est pas la situation appropriée pour l'insertion d'une canule oropharyngée."
        },
        {
            "text": "En cas d'arrêt cardiaque chez une victime où maintenir les voies aériennes est difficile",
            "isCorrect": true,
            "comment": "Correct, la canule oropharyngée est utile dans ce contexte pour maintenir les voies aériennes."
        },
        {
            "text": "Pour aider une victime à réguler sa température corporelle",
            "isCorrect": false,
            "comment": "L'insertion d'une canule oropharyngée n'est pas liée à la régulation de la température corporelle."
        },
        {
            "text": "Quand la victime a des blessures externes nécessitant un pansement",
            "isCorrect": false,
            "comment": "La mise en place d'une canule oropharyngée n'est pas nécessaire pour des blessures externes."
        }
    ]
},
{
    "text": "Quelle est la principale fonction de la canule oropharyngée lors de son insertion ?",
    "answers": [
        {
            "text": "Empêcher la victime de parler",
            "isCorrect": false,
            "comment": "Ce n'est pas la principale fonction de la canule oropharyngée."
        },
        {
            "text": "Assurer une ventilation artificielle à la victime",
            "isCorrect": false,
            "comment": "La canule oropharyngée ne permet pas directement la ventilation artificielle."
        },
        {
            "text": "Maintenir la langue éloignée de la paroi postérieure du pharynx",
            "isCorrect": true,
            "comment": "Correct, c'est la principale fonction de la canule oropharyngée pour assurer un passage d'air."
        },
        {
            "text": "Empêcher la victime de fermer la bouche",
            "isCorrect": false,
            "comment": "Cela n'est pas la fonction principale de la canule oropharyngée."
        }
    ]
},
{
    "text": "Quelle est la principale raison pour laquelle la libération des voies aériennes (LVA) par simple élévation du menton est recommandée chez une victime inconsciente suspectée d'un traumatisme du rachis ?",
    "answers": [
        {
            "text": "Pour vérifier la circulation sanguine",
            "isCorrect": false,
            "comment": "La libération des voies aériennes par élévation du menton ne concerne pas la vérification de la circulation sanguine."
        },
        {
            "text": "Pour éviter une obstruction des voies respiratoires par la chute de la langue",
            "isCorrect": true,
            "comment": "Correct, cette méthode vise à maintenir les voies respiratoires dégagées."
        },
        {
            "text": "Pour immobiliser le rachis cervical",
            "isCorrect": false,
            "comment": "L'élévation du menton n'est pas utilisée pour immobiliser le rachis cervical."
        },
        {
            "text": "Pour administrer des médicaments à la victime",
            "isCorrect": false,
            "comment": "Cette méthode ne concerne pas l'administration de médicaments."
        }
    ]
},
{
    "text": "Quelle est la précaution spécifique à prendre lors de la libération des voies aériennes chez un nourrisson ?",
    "answers": [
        {
            "text": "Maintenir la tête dans une position surélevée",
            "isCorrect": false,
            "comment": "Cela n'est pas la précaution spécifique à prendre lors de la libération des voies aériennes chez un nourrisson."
        },
        {
            "text": "Effectuer un mouvement de rotation de la tête",
            "isCorrect": false,
            "comment": "La rotation de la tête n'est pas recommandée pour la libération des voies aériennes chez un nourrisson."
        },
        {
            "text": "Limiter le mouvement pour éviter une obstruction des voies aériennes",
            "isCorrect": true,
            "comment": "Correct, la précaution principale est de limiter le mouvement pour éviter une obstruction."
        },
        {
            "text": "Appliquer une pression sur le thorax pour faciliter la respiration",
            "isCorrect": false,
            "comment": "Cela n'est pas la précaution spécifique pour la libération des voies aériennes chez un nourrisson."
        }
    ]
},

{
    "text": "Quand est-il recommandé d'utiliser un pansement compressif ?",
    "answers": [
        {
            "text": "Pour prévenir les infections cutanées",
            "isCorrect": false,
            "comment": "Un pansement compressif n'est pas utilisé principalement pour prévenir les infections cutanées."
        },
        {
            "text": "Pour maintenir une pression constante sur une plaie qui saigne",
            "isCorrect": true,
            "comment": "Correct, un pansement compressif est utilisé pour contrôler les saignements en appliquant une pression."
        },
        {
            "text": "Pour réduire l'enflure d'une blessure",
            "isCorrect": false,
            "comment": "La réduction de l'enflure n'est pas la fonction principale d'un pansement compressif."
        },
        {
            "text": "Pour immobiliser une articulation blessée",
            "isCorrect": false,
            "comment": "L'immobilisation d'une articulation blessée est réalisée avec un autre type de pansement."
        }
    ]
},
{
    "text": "Qu'est-ce qui est particulièrement important lors de l'application d'un pansement compressif d'urgence ?",
    "answers": [
        {
            "text": "S'assurer que la victime ne ressent aucune douleur pendant l'application",
            "isCorrect": false,
            "comment": "La douleur de la victime est importante, mais le maintien de la pression pour arrêter l'hémorragie est primordial."
        },
        {
            "text": "Utiliser une bande élastique avec peu d'élasticité",
            "isCorrect": false,
            "comment": "L'utilisation d'une bande élastique avec peu d'élasticité peut ne pas fournir une pression suffisante."
        },
        {
            "text": "Tendre le bandage élastique en tirant la languette de maintien vers le haut",
            "isCorrect": false,
            "comment": "Tendre excessivement le bandage peut causer des problèmes circulatoires."
        },
        {
            "text": "Maintenir une pression suffisante pour arrêter l'hémorragie",
            "isCorrect": true,
            "comment": "Correct, le maintien d'une pression adéquate est crucial pour contrôler les saignements."
        }
    ]
},
{
    "text": "Dans quelles circonstances est-il recommandé d'utiliser une gaze imbibée de substance hémostatique ?",
    "answers": [
        {
            "text": "Pour tout type d'hémorragie externe",
            "isCorrect": false,
            "comment": "Une gaze imbibée de substance hémostatique n'est pas nécessaire pour tous les types d'hémorragie externe."
        },
        {
            "text": "Lorsque la compression manuelle ne suffit pas ou n'est pas possible, notamment pour certaines localisations de plaies",
            "isCorrect": true,
            "comment": "Correct, elle est utilisée lorsque la compression manuelle est insuffisante ou impossible."
        },
        {
            "text": "Uniquement en cas d'hémorragie interne",
            "isCorrect": false,
            "comment": "Une gaze hémostatique n'est pas utilisée pour les hémorragies internes."
        },
        {
            "text": "Pour les plaies superficielles ne nécessitant pas de pression constante",
            "isCorrect": false,
            "comment": "Elle est utilisée spécifiquement lorsque la compression manuelle est insuffisante."
        }
    ]
},
{
    "text": "Quelles sont les étapes de mise en œuvre d'un défibrillateur automatisé externe ?",
    "answers": [
        {
            "text": "3 étapes: connexion des électrodes, analyse du rythme cardiaque, délivrance du choc",
            "isCorrect": false,
            "comment": "Il y a une étape supplémentaire avant la délivrance du choc."
        },
        {
            "text": "4 étapes: mise en marche de l'appareil, connexion des électrodes, analyse du rythme cardiaque, délivrance du choc",
            "isCorrect": false,
            "comment": "Il y a une autre étape nécessaire avant la connexion des électrodes."
        },
        {
            "text": "5 étapes: mise en marche de l'appareil, connexion des électrodes, analyse du rythme cardiaque, délivrance du choc, arrêt de l'appareil",
            "isCorrect": true,
            "comment": "Correct, ces sont les étapes correctes de l'utilisation d'un défibrillateur automatisé externe."
        },
        {
            "text": "6 étapes: mise en marche de l'appareil, connexion des électrodes, analyse du rythme cardiaque, délivrance du choc, vérification de l'état de la victime, arrêt de l'appareil",
            "isCorrect": false,
            "comment": "Il n'y a pas de vérification de l'état de la victime après la délivrance du choc."
        }
    ]
},
{
    "text": "Quel est l'indicateur principal pour juger de l'efficacité de la ventilation artificielle par un insufflateur manuel ?",
    "answers": [
        {
            "text": "Le nombre de compressions thoraciques effectuées par minute.",
            "isCorrect": false,
            "comment": "Le nombre de compressions thoraciques n'est pas un indicateur de l'efficacité de la ventilation."
        },
        {
            "text": "Le soulèvement de la poitrine de la victime lors de chaque insufflation.",
            "isCorrect": true,
            "comment": "Correct, le soulèvement de la poitrine indique une ventilation efficace."
        },
        {
            "text": "La température corporelle de la victime.",
            "isCorrect": false,
            "comment": "La température corporelle n'est pas un indicateur direct de l'efficacité de la ventilation."
        },
        {
            "text": "Le taux de saturation en oxygène dans le sang.",
            "isCorrect": false,
            "comment": "Bien que important, le taux de saturation en oxygène n'est pas l'indicateur principal de l'efficacité de la ventilation."
        }
    ]
},
{
    "text": "Quel est le risque principal associé à une insufflation trop rapide ou un volume d'air trop important lors de la ventilation artificielle par un insufflateur manuel ?",
    "answers": [
        {
            "text": "Un engourdissement des membres.",
            "isCorrect": false,
            "comment": "L'engourdissement des membres n'est pas un risque associé à une ventilation excessive."
        },
        {
            "text": "Une baisse de la pression artérielle.",
            "isCorrect": false,
            "comment": "Une baisse de la pression artérielle peut être due à une hyperventilation, mais ce n'est pas le risque principal associé."
        },
        {
            "text": "Une régurgitation de liquide de l'estomac dans les voies aériennes.",
            "isCorrect": true,
            "comment": "Correct, une ventilation excessive peut entraîner une régurgitation de liquide de l'estomac dans les voies aériennes."
        },
        {
            "text": "Une augmentation de la fréquence respiratoire.",
            "isCorrect": false,
            "comment": "Une augmentation de la fréquence respiratoire est un effet possible de la ventilation excessive, mais ce n'est pas le risque principal associé."
        }
    ]
},
{
    "text": "Quel est le principal objectif de la position latérale de sécurité (PLS) ?",
    "answers": [
        {
            "text": "Immobiliser complètement la victime.",
            "isCorrect": false,
            "comment": "La PLS vise à assurer la sécurité des voies respiratoires, pas à immobiliser la victime."
        },
        {
            "text": "Éviter que la langue ne tombe dans le fond de la gorge.",
            "isCorrect": true,
            "comment": "Correct, le principal objectif de la PLS est de prévenir l'obstruction des voies respiratoires par la langue."
        },
        {
            "text": "Réaliser un massage cardiaque.",
            "isCorrect": false,
            "comment": "La PLS ne vise pas à réaliser un massage cardiaque."
        },
        {
            "text": "Limiter les mouvements des membres supérieurs.",
            "isCorrect": false,
            "comment": "La PLS ne vise pas à limiter les mouvements des membres supérieurs."
        }
    ]
},
{
    "text": "Quelle est la principale contrainte associée à la mise en place de la position latérale de sécurité ?",
    "answers": [
        {
            "text": "Risque d'aggraver une lésion traumatique, notamment du rachis ou du bassin.",
            "isCorrect": true,
            "comment": "Correct, la mise en place de la PLS peut aggraver les lésions traumatiques du rachis ou du bassin."
        },
        {
            "text": "Risque de brûlures cutanées.",
            "isCorrect": false,
            "comment": "Les brûlures cutanées ne sont pas une contrainte associée à la PLS."
        },
        {
            "text": "Difficulté à maintenir la ventilation de la victime.",
            "isCorrect": false,
            "comment": "La PLS vise à maintenir les voies respiratoires dégagées, elle ne devrait pas rendre la ventilation difficile."
        },
        {
            "text": "Nécessité d'un équipement spécialisé.",
            "isCorrect": false,
            "comment": "La mise en place de la PLS ne nécessite pas d'équipement spécialisé."
        }
    ]
},
{
    "text": "Quelle est la principale indication pour la mise en place de la position latérale de sécurité à un secouriste ?",
    "answers": [
        {
            "text": "Victime en arrêt cardiaque.",
            "isCorrect": false,
            "comment": "La position latérale de sécurité n'est pas appropriée pour une victime en arrêt cardiaque."
        },
        {
            "text": "Victime inconsciente qui respire.",
            "isCorrect": true,
            "comment": "Correct, la PLS est utilisée pour une victime qui respire normalement mais est inconsciente."
        },
        {
            "text": "Victime ayant une fracture ouverte.",
            "isCorrect": false,
            "comment": "La mise en place de la PLS n'est pas spécifiquement indiquée pour une fracture ouverte."
        },
        {
            "text": "Victime présentant une intoxication alimentaire.",
            "isCorrect": false,
            "comment": "Une intoxication alimentaire n'est pas une indication directe pour la PLS."
        }
    ]
},
{
    "text": "Quel est l'objectif principal de l'administration d'oxygène par inhalation ?",
    "answers": [
        {
            "text": "Augmenter la quantité de dioxyde de carbone dans le sang.",
            "isCorrect": false,
            "comment": "L'administration d'oxygène ne vise pas à augmenter la quantité de dioxyde de carbone."
        },
        {
            "text": "Diminuer la quantité d'oxygène dans le cerveau.",
            "isCorrect": false,
            "comment": "L'objectif est d'augmenter la quantité d'oxygène dans le cerveau, pas de la diminuer."
        },
        {
            "text": "Maintenir la saturation en oxygène à des niveaux appropriés.",
            "isCorrect": true,
            "comment": "Correct, l'administration d'oxygène vise à maintenir des niveaux appropriés d'oxygène dans le sang."
        },
        {
            "text": "Favoriser l'accumulation d'azote dans les poumons.",
            "isCorrect": false,
            "comment": "L'administration d'oxygène ne vise pas à accumuler de l'azote dans les poumons."
        }
    ]
},
{
    "text": "Quel est le principal objectif de l'utilisation d'une bouteille d'oxygène ?",
    "answers": [
        {
            "text": "Administration d'anesthésie.",
            "isCorrect": false,
            "comment": "L'utilisation d'une bouteille d'oxygène n'est pas principalement pour l'administration d'anesthésie."
        },
        {
            "text": "Enrichissement de l'air en oxygène.",
            "isCorrect": true,
            "comment": "Correct, l'objectif principal est d'enrichir l'air en oxygène pour l'administration à une victime."
        },
        {
            "text": "Réduction de la pression atmosphérique.",
            "isCorrect": false,
            "comment": "La bouteille d'oxygène ne vise pas à réduire la pression atmosphérique."
        },
        {
            "text": "Contrôle de la pression artérielle.",
            "isCorrect": false,
            "comment": "Le contrôle de la pression artérielle n'est pas l'objectif principal de l'utilisation d'une bouteille d'oxygène."
        }
    ]
},
{
    "text": "Quelles sont les consignes de stockage et de transport appropriées pour les bouteilles d'oxygène ?",
    "answers": [
        {
            "text": "Les bouteilles doivent être stockées en position horizontale.",
            "isCorrect": false,
            "comment": "Les bouteilles doivent être stockées en position verticale pour des raisons de sécurité."
        },
        {
            "text": "Les bouteilles peuvent être conservées dans des endroits fermés sans ventilation.",
            "isCorrect": false,
            "comment": "Les bouteilles doivent être stockées dans des endroits bien ventilés pour éviter l'accumulation de gaz potentiellement dangereux."
        },
        {
            "text": "Les bouteilles doivent être maintenues en position verticale, robinet fermé.",
            "isCorrect": true,
            "comment": "Correct, les bouteilles d'oxygène doivent être stockées verticalement pour éviter tout risque de fuite, avec le robinet fermé."
        },
        {
            "text": "Les bouteilles peuvent être traînées ou roulées sur le sol lorsqu'elles sont déplacées.",
            "isCorrect": false,
            "comment": "Les bouteilles d'oxygène doivent être manipulées avec précaution pour éviter tout dommage ou fuite."
        }
    ]
},
{
    "text": "Quels sont les principaux signes indiquant la nécessité de réchauffer une victime ?",
    "answers": [
        {
            "text": "Frissons et température corporelle élevée.",
            "isCorrect": false,
            "comment": "Une température corporelle élevée peut indiquer un besoin de refroidissement, pas de réchauffement."
        },
        {
            "text": "Exposition prolongée à la chaleur et sueurs abondantes.",
            "isCorrect": false,
            "comment": "Ces signes indiquent plutôt un risque de surchauffe, pas de besoin de réchauffement."
        },
        {
            "text": "Détresse circulatoire et hypothermie.",
            "isCorrect": true,
            "comment": "Correct, la détresse circulatoire et l'hypothermie sont des signes nécessitant un réchauffement de la victime."
        },
        {
            "text": "État de somnolence et baisse de la pression artérielle.",
            "isCorrect": false,
            "comment": "Ces signes peuvent indiquer différents problèmes, mais pas nécessairement un besoin de réchauffement."
        }
    ]
},


{
    "text": "Quelle est la définition de la perte de connaissance selon les recos ?",
    "answers": [
    {
    "text": "Une baisse temporaire de la perception sensorielle.",
    "isCorrect": false,
    "comment": "Ce n'est pas la définition de la perte de connaissance selon les recos."
    },
    {
    "text": "La perte permanente de l'aptitude à communiquer avec l'environnement.",
    "isCorrect": false,
    "comment": "Non, la perte de connaissance peut être permanente ou temporaire selon les recos."
    },
    {
    "text": "La perte permanente ou temporaire de l'aptitude à communiquer et à réagir avec d'autres personnes et avec l'environnement.",
    "isCorrect": true,
    "comment": "Correct ! C'est la définition de la perte de connaissance selon les recos."
    },
    {
    "text": "Une incapacité soudaine à se souvenir de son nom et de son adresse.",
    "isCorrect": false,
    "comment": "Cette réponse ne correspond pas à la définition de la perte de connaissance dans les recos."
    }
    ]
    },

    {
    "text": "Quels sont les risques associés à une personne qui a perdu connaissance et est laissée sur le dos ?",
    "answers": [
    {
    "text": "Une augmentation du tonus musculaire qui peut entraîner une respiration sifflante.",
    "isCorrect": false,
    "comment": "Ce n'est pas l'effet attendu lorsque quelqu'un est laissé sur le dos après avoir perdu connaissance."
    },
    {
    "text": "Une diminution des réflexes qui peut entraîner une respiration accélérée.",
    "isCorrect": false,
    "comment": "Non, cela ne correspond pas aux risques énoncés dans les recos."
    },
    {
    "text": "Une forte diminution du tonus musculaire, pouvant entraîner une obstruction des voies aériennes par la chute de la langue en arrière.",
    "isCorrect": true,
    "comment": "Correct ! C'est un risque évoqué dans les recos."
    },
    {
    "text": "Une augmentation des réflexes de déglutition, empêchant l'encombrement des voies respiratoires.",
    "isCorrect": false,
    "comment": "Ceci ne correspond pas à un risque énoncé dans les recos."
    }
    ]
    },

    {
    "text": "Comment devrait-on agir envers une victime de perte de connaissance qui respire et n'est pas suspecte d'un traumatisme ?",
    "answers": [
    {
    "text": "La placer en position assise pour faciliter la respiration.",
    "isCorrect": false,
    "comment": "Ceci n'est pas la recommandation principale pour une victime de perte de connaissance selon les recos."
    },
    {
    "text": "La maintenir sur le ventre pour éviter toute aspiration.",
    "isCorrect": false,
    "comment": "Non, cette position n'est pas recommandée dans le contexte d'une perte de connaissance selon les recos."
    },
    {
    "text": "La placer en position latérale de sécurité pour maintenir la liberté des voies aériennes.",
    "isCorrect": true,
    "comment": "Correct ! C'est la recommandation principale pour une victime de perte de connaissance qui respire et n'est pas suspecte d'un traumatisme."
    },
    {
    "text": "Lui administrer de l'oxygène en inhalation uniquement si elle montre des signes de détresse respiratoire.",
    "isCorrect": false,
    "comment": "Ceci n'est pas la première action recommandée selon les recos."
    }
    ]
    },

    {
    "text": "Quelle est la recommandation pour la position d'une victime enceinte lorsqu'elle est placée en position latérale de sécurité ?",
    "answers": [
    {
    "text": "Position latérale droite.",
    "isCorrect": false,
    "comment": "Ce n'est pas la recommandation spécifique pour une victime enceinte dans les recos."
    },
    {
    "text": "Position ventrale.",
    "isCorrect": false,
    "comment": "Non, cette position n'est pas recommandée pour une victime enceinte dans les recos."
    },
    {
    "text": "Position latérale gauche.",
    "isCorrect": true,
    "comment": "Correct ! La position latérale gauche est préférable pour une victime enceinte dans les recos."
    },
    {
    "text": "Position assise.",
    "isCorrect": false,
    "comment": "Cette réponse ne correspond pas à la recommandation spécifique pour une victime enceinte."
    }
    ]
    },

    {
    "text": "Quelles actions devraient être entreprises envers une victime qui a perdu connaissance, respire, et est suspecte d'un traumatisme ?",
    "answers": [
    {
    "text": "La laisser sur le dos sans mouvement.",
    "isCorrect": false,
    "comment": "Non, cette action n'est pas recommandée pour une victime suspecte d'un traumatisme selon les recos."
    },
    {
    "text": "Maintenir la tête de la victime immobile.",
    "isCorrect": false,
    "comment": "Ceci est une bonne pratique pour une victime de traumatisme, mais ce n'est pas la seule action à entreprendre."
    },
    {
    "text": "Assurer une liberté permanente des voies aériennes.",
    "isCorrect": true,
    "comment": "Correct ! C'est une action importante pour une victime suspecte d'un traumatisme selon les recos. La PLS n'est possible qu'après avis médical."
    },
    {
    "text": "La placer en position assise pour faciliter la respiration.",
    "isCorrect": false,
    "comment": "Cette action n'est pas recommandée pour une victime suspecte d'un traumatisme dans les recos."
    }
    ]
    },





 {
    "text": "Qu'est-ce que l'obstruction des voies aériennes et quelles sont ses deux formes ?",
    "answers": [
    {
    "text": "L'obstruction des voies aériennes est la gêne ou l'empêchement brutal des mouvements de l'air entre l'extérieur et les poumons. Ses deux formes sont l'obstruction partielle et l'obstruction totale.",
    "isCorrect": true,
    "comment": "Correct ! L'obstruction partielle et totale sont les deux formes d'obstruction des voies aériennes."
    },
    {
    "text": "C'est un problème respiratoire qui ne comporte qu'une seule forme, l'obstruction totale.",
    "isCorrect": false,
    "comment": "Non, l'obstruction des voies aériennes peut être partielle ou totale."
    },
    {
    "text": "L'obstruction des voies aériennes est due uniquement à des allergies, sans formes spécifiques.",
    "isCorrect": false,
    "comment": "Ceci est incorrect. L'obstruction peut avoir différentes causes et formes."
    },
    {
    "text": "Il s'agit d'un trouble cardiaque caractérisé par un rythme irrégulier du cœur.",
    "isCorrect": false,
    "comment": "Ce n'est pas la définition d'une obstruction des voies aériennes."
    }
    ]
    },

    {
    "text": "Quels sont les corps étrangers les plus courants à l'origine d'une obstruction brutale des voies aériennes ?",
    "answers": [
    {
    "text": "Les aliments comme les noix, les cacahuètes et les carottes.",
    "isCorrect": true,
    "comment": "Correct ! Ces aliments sont souvent impliqués dans les obstructions des voies aériennes."
    },
    {
    "text": "Les liquides tels que l'eau et les boissons gazeuses.",
    "isCorrect": false,
    "comment": "Pas tout à fait. Les liquides ne sont pas souvent la cause d'une obstruction brutale des voies aériennes."
    },
    {
    "text": "Les objets tranchants comme les couteaux et les ciseaux.",
    "isCorrect": false,
    "comment": "Non, les objets tranchants sont moins courants dans ce contexte."
    },
    {
    "text": "Les substances chimiques telles que les produits de nettoyage.",
    "isCorrect": false,
    "comment": "Ce n'est pas une cause courante d'obstruction des voies aériennes."
    }
    ]
    },

    {
    "text": "Quels sont les facteurs de risque associés à l'obstruction des voies aériennes par un corps étranger ?",
    "answers": [
    {
    "text": "Les maladies neurologiques qui diminuent ou altèrent la déglutition ou la toux.",
    "isCorrect": true,
    "comment": "Correct ! Ces maladies peuvent augmenter le risque d'obstruction des voies aériennes."
    },
    {
    "text": "La pratique régulière d'exercices physiques intenses.",
    "isCorrect": false,
    "comment": "Non, l'exercice physique intense n'est pas un facteur de risque direct."
    },
    {
    "text": "La consommation excessive de bonbons et de sucreries.",
    "isCorrect": false,
    "comment": "Ceci n'est pas un facteur de risque connu pour ce type d'obstruction."
    },
    {
    "text": "Le port de lunettes de soleil par temps nuageux.",
    "isCorrect": false,
    "comment": "Cette réponse est hors sujet par rapport aux facteurs de risque d'obstruction des voies aériennes."
    }
    ]
    },

    {
    "text": "Quels sont les risques et les conséquences d'une obstruction complète des voies aériennes ?",
    "answers": [
    
    {
    "text": "Des lésions internes.",
    "isCorrect": false,
    "comment": "Pas nécessairement. Les lésions internes ne sont pas une conséquence directe d'une obstruction des voies aériennes."
    },
    {
    "text": "L'arrêt de la respiration.",
    "isCorrect": true,
    "comment": "Correct ! Une obstruction complète peut entraîner l'arrêt de la respiration."
    },
    {
    "text": "La réduction de la taille des voies respiratoires.",
    "isCorrect": false,
    "comment": "Ce n'est pas une conséquence directe d'une obstruction complète."
    },
    {
    "text": "Des complications secondaires telles que des infections pulmonaires.",
    "isCorrect": false,
    "comment": "Non, les complications secondaires peuvent survenir mais ne sont pas directement liées à l'obstruction complète des voies aériennes."
    }
    ]
    }, 


{
    "text": "Quand l'administration d'oxygène par insufflation est-elle réalisée ?",
    "answers": [
    {
    "text": "Lorsque la victime respire normalement.",
    "isCorrect": false,
    "comment": "Cette réponse ne correspond pas au moment où l'administration d'oxygène par insufflation est réalisée."
    },
    {
    "text": "Quand le secouriste n'a pas accès à une source d'oxygène.",
    "isCorrect": false,
    "comment": "Ce n'est pas le moment recommandé pour l'administration d'oxygène par insufflation."
    },
    {
    "text": "Lorsque le secouriste effectue une ventilation artificielle par insufflateur manuel et qu'il dispose d'une source d'oxygène.",
    "isCorrect": true,
    "comment": "Correct ! L'administration d'oxygène par insufflation est réalisée lors de la ventilation artificielle et en présence d'une source d'oxygène."
    },
    {
    "text": "Uniquement en cas d'arrêt cardiaque.",
    "isCorrect": false,
    "comment": "L'administration d'oxygène par insufflation n'est pas réservée exclusivement aux cas d'arrêt cardiaque."
    }
    ]
    },



    {
    "text": "Quel matériel est nécessaire pour réaliser l'administration d'oxygène par insufflation ?",
    "answers": [
    {
    "text": "Un seul masque facial.",
    "isCorrect": false,
    "comment": "Non, plusieurs éléments de matériel sont nécessaires pour cette procédure."
    },
    {
    "text": "Un débitmètre et une pompe à dépression.",
    "isCorrect": false,
    "comment": "Ce n'est pas le matériel requis pour l'administration d'oxygène par insufflation."
    },
    {
    "text": "Une bouteille d'oxygène, un insufflateur manuel, un ballon-réserve.",
    "isCorrect": true,
    "comment": "Correct ! Ces éléments sont nécessaires pour administrer de l'oxygène par insufflation."
    },
    {
    "text": "Des électrodes pour surveiller l'activité cardiaque de la victime.",
    "isCorrect": false,
    "comment": "Ces électrodes ne sont pas utilisées pour l'administration d'oxygène par insufflation."
    }
    ]
    },

    {
    "text": "Quelle évaluation doit être réalisée après l'administration d'oxygène par insufflation ?",
    "answers": [
    {
    "text": "La mesure de la tension artérielle.",
    "isCorrect": false,
    "comment": "Non, la tension artérielle n'est pas spécifiquement mentionnée dans le contexte de l'évaluation après l'administration d'oxygène par insufflation."
    },
    {
    "text": "L'évaluation sur le degré de remplissage du ballon-réserve.",
    "isCorrect": true,
    "comment": "Correct ! L'évaluation après l'administration d'oxygène par insufflation implique de vérifier le degré de remplissage du ballon-réserve."
    },
    {
    "text": "La mesure du taux de glucose dans le sang.",
    "isCorrect": false,
    "comment": "Ceci ne fait pas partie de l'évaluation recommandée après l'administration d'oxygène par insufflation."
    },
    {
    "text": "La mesure de la fréquence cardiaque.",
    "isCorrect": false,
    "comment": "La fréquence cardiaque n'est pas mentionnée comme faisant partie de l'évaluation après l'administration d'oxygène par insufflation."
    }
    ]
    },


{
"text": "Quelle est la fréquence recommandée pour les compressions thoraciques ?",
"answers": [
{
"text": "Entre 100 et 120 compressions par minute.",
"isCorrect": true,
"comment": "Correct ! Cette fréquence est recommandée pour les compressions thoraciques."
},
{
"text": "Entre 50 et 60 compressions par minute.",
"isCorrect": false,
"comment": "C'est une fréquence trop basse pour les compressions thoraciques."
},
{
"text": "Entre 150 et 160 compressions par minute.",
"isCorrect": false,
"comment": "C'est une fréquence trop élevée pour les compressions thoraciques."
},
{
"text": "Entre 80 et 90 compressions par minute.",
"isCorrect": false,
"comment": "C'est une fréquence trop basse pour les compressions thoraciques."
}
]
},
{
"text": "Quelle est la technique de désobstruction des voies aériennes utilisée en cas d'obstruction complète ?",
"answers": [

{
"text": "Les compressions abdominales.",
"isCorrect": false,
"comment": "Cette technique est utilisée après une série de claques dans le dos inefficaces."
},
{
    "text": "Les claques dans le dos.",
    "isCorrect": true,
    "comment": "Correct ! Les claques dans le dos sont utilisées en cas d'obstruction complète des voies aériennes."
    },
{
"text": "Les compressions thoraciques.",
"isCorrect": false,
"comment": "Les compressions thoraciques sont utilisées en cas d'arrêt cardiaque, pas d'obstruction des voies aériennes."
},
{
"text": "L'insufflation bouche-à-bouche.",
"isCorrect": false,
"comment": "Cette technique est utilisée pour la ventilation artificielle, pas pour désobstruer les voies aériennes."
}
]
},
{
"text": "Comment se positionne la victime pour les compressions thoraciques chez l'adulte ?",
"answers": [
{
"text": "Sur le dos.",
"isCorrect": true,
"comment": "C'est bien ça, la victime est positionnée sur le dos pour les compressions thoraciques chez l'adulte."
},
{
"text": "À genoux, la face vers le sol.",
"isCorrect": false,
"comment": "Cette position est celle du sauveteur, pas de la victime."
},
{
"text": "Debout ou assise.",
"isCorrect": false,
"comment": "Ces positions ne sont pas recommandées pour les compressions thoraciques."
},
{
"text": "Sur le côté, légèrement inclinée.",
"isCorrect": false,
"comment": "Cette position n'est pas recommandée pour les compressions thoraciques."
}
]
},
{
"text": "Quelle est la profondeur recommandée des compressions thoraciques chez l'adulte ?",
"answers": [
{
"text": "Environ 5 cm.",
"isCorrect": true,
"comment": "Correct ! Une profondeur d'environ 5 cm est recommandée pour les compressions thoraciques chez l'adulte. C'est environ 1/3 de la personne."
},
{
"text": "Environ 10 cm.",
"isCorrect": false,
"comment": "C'est une profondeur excessive pour les compressions thoraciques."
},
{
"text": "Environ 3 cm.",
"isCorrect": false,
"comment": "C'est une profondeur trop faible pour les compressions thoraciques."
},
{
"text": "Environ 8 cm.",
"isCorrect": false,
"comment": "C'est une profondeur excessive pour les compressions thoraciques."
}
]
},
{
"text": "Quelle est la position idéale des mains lors des compressions thoraciques ?",
"answers": [

{
"text": "Au-dessus de la tête de la victime.",
"isCorrect": false,
"comment": "Cette position n'est pas recommandée pour les compressions thoraciques."
},
{
"text": "Au niveau des côtes de la victime.",
"isCorrect": false,
"comment": "Ceci n'est pas recommandé car cela peut causer des lésions."
},
{
"text": "Sur le cou de la victime.",
"isCorrect": false,
"comment": "Cette position n'est pas recommandée pour les compressions thoraciques."
},
{
"text": "Au centre de la poitrine, sur le sternum.",
"isCorrect": true,
"comment": "Correct ! Les mains doivent être placées au centre de la poitrine, sur le sternum, pour les compressions thoraciques."
},
]
},
{
"text": "À quelle fréquence devons nous relayer le secouriste qui masse lors d'un ACR ?",
"answers": [
{
"text": "Toutes les 2 minutes.",
"isCorrect": true,
"comment": "Correct ! Les compressions thoraciques doivent être relayées toutes les 2 minutes en présence de plusieurs sauveteurs."
},
{
"text": "Toutes les 5 minutes.",
"isCorrect": false,
"comment": "C'est une période trop longue entre les relais pour les compressions thoraciques."
},
{
"text": "Toutes les 10 minutes.",
"isCorrect": false,
"comment": "C'est une période trop longue entre les relais pour les compressions thoraciques."
},

{
"text": "Toutes les 15 minutes.",
"isCorrect": false,
"comment": "C'est une période trop longue entre les relais pour les compressions thoraciques."
}
]
},
{
"text": "Pourquoi est-il crucial de maintenir une fréquence de compression égale au temps de relâchement ?",
"answers": [


{
"text": "Pour maintenir une pression constante sur le thorax.",
"isCorrect": false,
"comment": "La pression doit varier pour permettre au cœur de se remplir de sang."
},
{


"text": "Pour permettre au cœur de se remplir de sang.",
"isCorrect": true,
"comment": "Correct ! Maintenir une fréquence de compression égale au temps de relâchement permet au cœur de se remplir de sang."
    
    
},
{
"text": "Pour éviter les lésions des organes internes.",
"isCorrect": false,
"comment": "C'est important pour éviter les lésions, mais ce n'est pas la raison principale."
},
{
"text": "Pour assurer une ventilation adéquate.",
"isCorrect": false,
"comment": "La ventilation est liée à la respiration, pas à la circulation sanguine."
}
]
},


{
"text": "Quel risque peut survenir lors de la réalisation des compressions abdominales ?",
"answers": [
{
"text": "Des lésions des organes internes, des côtes et du sternum.",
"isCorrect": true,
"comment": "Correct ! Les compressions abdominales peuvent entraîner des lésions des organes internes, des côtes et du sternum."
},
{
"text": "Une augmentation du débit cardiaque.",
"isCorrect": false,
"comment": "Les compressions abdominales n'entraînent pas nécessairement une augmentation du débit cardiaque."
},
{
"text": "Une diminution de la pression artérielle.",
"isCorrect": false,
"comment": "Ceci n'est pas un risque courant des compressions abdominales."
},
{
"text": "Des crampes musculaires.",
"isCorrect": false,
"comment": "Les crampes musculaires sont peu probables lors de la réalisation des compressions abdominales."
}
]
},
{
"text": "Comment est évaluée l'efficacité des compressions abdominales chez l'adulte lors d'une OBVA ?",
"answers": [
{
"text": "Par le rejet du corps étranger.",
"isCorrect": true,
"comment": "Correct ! L'efficacité des compressions abdominales est évaluée par le rejet du corps étranger."
},
{
"text": "Par l'apparition de toux.",
"isCorrect": false,
"comment": "C'est une indication de l'efficacité des compressions thoraciques, pas abdominales."
},
{
"text": "Par l'apparition de pleurs.",
"isCorrect": false,
"comment": "Les pleurs ne sont pas nécessairement une indication de l'efficacité des compressions abdominales."
},
{
"text": "Par la recoloration de la victime.",
"isCorrect": false,
"comment": "La recoloration de la victime est une indication de l'efficacité des compressions thoraciques, pas abdominales."
}
]
},

{
"text": "Quel risque peut survenir lors de la réalisation des compressions thoraciques sur une personne obèse ou une femme enceinte ?",
"answers": [
{
"text": "Des complications par traumatisme des organes internes, des côtes ou du sternum.",
"isCorrect": true,
"comment": "Correct ! Des complications par traumatisme des organes internes, des côtes ou du sternum peuvent survenir lors de la réalisation des compressions thoraciques sur une personne obèse ou une femme enceinte."
},
{
"text": "Une augmentation de la pression artérielle.",
"isCorrect": false,
"comment": "Ceci n'est pas un risque courant des compressions thoraciques sur une personne obèse ou une femme enceinte."
},
{
"text": "Une diminution du débit cardiaque.",
"isCorrect": false,
"comment": "Ceci n'est pas un risque courant des compressions thoraciques sur une personne obèse ou une femme enceinte."
},
{
"text": "Des crampes musculaires.",
"isCorrect": false,
"comment": "Les crampes musculaires sont peu probables lors de la réalisation des compressions thoraciques sur une personne obèse ou une femme enceinte."
}
]
},
{
"text": "Comment est évaluée l'efficacité des compressions thoraciques chez le nourrisson ?",
"answers": [
{
"text": "Par le rejet du corps étranger.",
"isCorrect": false,
"comment": "Les compressions thoraciques sont utilisées pour rétablir la circulation, pas pour désobstruer les voies aériennes."
},
{
"text": "Par l'apparition de toux.",
"isCorrect": false,
"comment": "C'est une indication de l'efficacité des compressions abdominales, pas thoraciques."
},
{
"text": "Par l'apparition de pleurs.",
"isCorrect": false,
"comment": "Les pleurs ne sont pas nécessairement une indication de l'efficacité des compressions thoraciques."
},
{
"text": "Par la reprise d'une respiration normale.",
"isCorrect": true,
"comment": "Correct ! L'efficacité des compressions thoraciques chez le nourrisson est évaluée par la reprise d'une respiration normale."
}
]
},




{
"text": "Quel est le matériel nécessaire pour réaliser un garrot improvisé selon les recos ?",
"answers": [
{
"text": "Un lien de toile forte de 3 à 5 cm de large et de 1,50 m de longueur au minimum, et un bâton de métal ou de bois solide.",
"isCorrect": true,
"comment": "Correct ! Le matériel nécessaire pour réaliser un garrot improvisé comprend un lien de toile forte et un bâton solide, comme indiqué dans les recos."
},
{
"text": "Un tissu doux et une corde solide.",
"isCorrect": false,
"comment": "Le matériel nécessaire pour réaliser un garrot improvisé est spécifié dans les recos et ne comprend pas un tissu doux et une corde solide."
},
{
"text": "Un garrot spécifique fourni dans les trousses de premiers secours.",
"isCorrect": false,
"comment": "les recos mentionne un garrot improvisé, pas un garrot spécifique fourni dans les trousses de premiers secours."
},
{
"text": "Un élastique et un bandage.",
"isCorrect": false,
"comment": "Ce matériel n'est pas mentionné comme étant nécessaire pour réaliser un garrot improvisé selon les recos."
}
]
},
{
"text": "Où doit-on positionner le garrot selon les indications du paragraphe ?",
"answers": [
{
"text": "À quelques centimètres de la plaie, entre la plaie et la racine du membre, jamais sur une articulation.",
"isCorrect": true,
"comment": "Correct ! Le garrot doit être positionné à quelques centimètres de la plaie, entre la plaie et la racine du membre, et jamais sur une articulation, comme spécifié dans les recos."
},
{
"text": "Directement sur la plaie pour arrêter le saignement.",
"isCorrect": false,
"comment": "Le garrot ne doit pas être positionné directement sur la plaie selon les indications du paragraphe."
},
{
"text": "À l'extrémité du membre blessé.",
"isCorrect": false,
"comment": "Le garrot ne doit pas être positionné à l'extrémité du membre blessé selon les indications du paragraphe."
},
{
"text": "Sur une articulation pour stabiliser le membre.",
"isCorrect": false,
"comment": "Le garrot ne doit jamais être positionné sur une articulation selon les indications du paragraphe."
}
]
},
{
"text": "Quelle est la procédure à suivre pour réaliser un garrot spécifique selon les recos ?",
"answers": [
{
"text": "Glisser la sangle du garrot autour du membre, fixer la sangle en la passant dans la boucle prévue à cet effet, actionner le dispositif de serrage jusqu’à l’obtention de l’arrêt du saignement, bloquer le dispositif de serrage.",
"isCorrect": true,
"comment": "Exact ! La procédure pour réaliser un garrot spécifique est détaillée dans les recos, incluant le glissement de la sangle, le serrage et le blocage du dispositif de serrage."
},
{
"text": "Enrouler le garrot autour du membre et faire un nœud.",
"isCorrect": false,
"comment": "Cette réponse ne décrit pas la procédure complète pour réaliser un garrot spécifique selon les recos."
},
{
"text": "Placer le garrot sur une articulation et le serrer jusqu'à l'arrêt du saignement.",
"isCorrect": false,
"comment": "Le garrot ne doit jamais être placé sur une articulation selon les indications du paragraphe."
},
{
"text": "Attacher le garrot autour du membre à l'aide d'un nœud.",
"isCorrect": false,
"comment": "Cette réponse ne décrit pas la procédure complète pour réaliser un garrot spécifique selon les recos."
}
]
},

{
"text": "Quel est le moment approprié pour desserrer un garrot selon les indications du paragraphe ?",
"answers": [
{
"text": "Sur ordre d’un médecin.",
"isCorrect": true,
"comment": "Exact ! Le garrot ne doit être desserré que sur ordre d’un médecin, comme indiqué dans les recos."
},
{
"text": "Lorsque la victime ressent une douleur intense.",
"isCorrect": false,
"comment": "Desserrer un garrot en réponse à la douleur n'est pas recommandé selon les indications du paragraphe."
},
{
"text": "Immédiatement après l'application.",
"isCorrect": false,
"comment": "Desserrer un garrot immédiatement après l'application n'est pas recommandé selon les indications du paragraphe."
},
{
"text": "Après un certain laps de temps, indépendamment des ordres médicaux.",
"isCorrect": false,
"comment": "Desserrer un garrot sans ordre médical n'est pas recommandé selon les indications du paragraphe."
}
]
},
{
"text": "Quel est le critère pour évaluer l'efficacité d'un garrot selon les recos ?",
"answers": [
{
"text": "L'arrêt du saignement.",
"isCorrect": true,
"comment": "Correct ! L'efficacité d'un garrot est évaluée en fonction de l'arrêt du saignement, comme indiqué dans les recos."
},
{
"text": "La réduction de la douleur de la victime.",
"isCorrect": false,
"comment": "La douleur de la victime n'est pas le critère principal pour évaluer l'efficacité d'un garrot selon les indications du paragraphe."
},
{
"text": "La coloration de la peau autour du garrot.",
"isCorrect": false,
"comment": "La coloration de la peau n'est pas le critère principal pour évaluer l'efficacité d'un garrot selon les indications du paragraphe."
},
{
"text": "La mobilité du membre blessé.",
"isCorrect": false,
"comment": "La mobilité du membre blessé n'est pas le critère principal pour évaluer l'efficacité d'un garrot selon les indications du paragraphe."
}
]
},
{
"text": "Quel est l'objectif principal de la libération des voies aériennes chez une victime assise selon les recos ?",
"answers": [
{
"text": "Rétablir la liberté des voies aériennes en empêchant l'obstruction par la base de la langue.",
"isCorrect": true,
"comment": "Exact ! L'objectif principal de la libération des voies aériennes chez une victime assise est de rétablir la liberté des voies aériennes en empêchant l'obstruction par la base de la langue, comme spécifié dans les recos."
},
{
"text": "Stabiliser la colonne vertébrale.",
"isCorrect": false,
"comment": "La stabilisation de la colonne vertébrale n'est pas l'objectif principal de la libération des voies aériennes chez une victime assise selon les recos."
},
{
"text": "Empêcher l'inhalation de fumée en cas d'incendie.",
"isCorrect": false,
"comment": "Empêcher l'inhalation de fumée est une mesure de sécurité différente et n'est pas l'objectif principal de la libération des voies aériennes chez une victime assise."
},
{
"text": "Faciliter la respiration de la victime.",
"isCorrect": false,
"comment": "Bien que faciliter la respiration soit un objectif, les recos spécifie que l'objectif principal est de rétablir la liberté des voies aériennes en empêchant l'obstruction par la base de la langue."
}
]
},
{
"text": "Quelle est la différence principale entre la libération des voies aériennes chez une victime non traumatisée et une victime traumatisée selon les recos ?",
"answers": [

{
"text": "Il n'y a pas de différence entre les deux procédures.",
"isCorrect": false,
"comment": "les recos spécifie une différence dans la procédure entre une victime non traumatisée et une victime traumatisée."
},
{
"text": "La libération des voies aériennes chez une victime non traumatisée se fait par la seule élévation du menton, tandis que chez une victime traumatisée, la tête est inclinée vers l'avant.",
"isCorrect": false,
"comment": "les recos indique que chez une victime non traumatisée, la libération des voies aériennes implique une bascule prudente de la tête en arrière et l'élévation du menton."
},
{
"text": "La libération des voies aériennes chez une victime non traumatisée implique une bascule prudente de la tête en arrière et l'élévation du menton, tandis que chez une victime traumatisée, seule l'élévation du menton est réalisée.",
"isCorrect": true,
"comment": "Correct ! La principale différence est que chez une victime non traumatisée, la libération des voies aériennes implique une bascule prudente de la tête en arrière et l'élévation du menton, tandis que chez une victime traumatisée, seule l'élévation du menton est réalisée, comme spécifié dans les recos."
},
{
"text": "La libération des voies aériennes chez une victime non traumatisée se fait par l'élévation du menton, tandis que chez une victime traumatisée, la tête est basculée en arrière et le menton est relevé.",
"isCorrect": false,
"comment": "les recos indique le contraire : chez une victime non traumatisée, la libération des voies aériennes implique une bascule prudente de la tête en arrière et l'élévation du menton."
}
]
},
{
"text": "Quel est le risque associé à la libération des voies aériennes chez une victime traumatisée selon les indications du paragraphe ?",
"answers": [

{
"text": "Une obstruction des voies aériennes.",
"isCorrect": false,
"comment": "Une obstruction des voies aériennes n'est pas le risque principal associé à la libération des voies aériennes chez une victime traumatisée."
},
{
"text": "Une blessure à la tête.",
"isCorrect": false,
"comment": "Bien que cela puisse être un risque, ce n'est pas le risque principal associé à la libération des voies aériennes chez une victime traumatisée."
},
{
"text": "Un arrêt respiratoire.",
"isCorrect": false,
"comment": "Un arrêt respiratoire n'est pas le risque principal associé à la libération des voies aériennes chez une victime traumatisée."
},
{
"text": "Une aggravation d'un traumatisme du rachis cervical.",
"isCorrect": true,
"comment": "Exact ! Le risque associé à la libération des voies aériennes chez une victime traumatisée est une aggravation d'un traumatisme du rachis cervical, comme spécifié dans les recos."
},
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
