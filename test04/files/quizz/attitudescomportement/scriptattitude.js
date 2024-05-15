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
  "text": "Quel est l'objectif principal de l'abord relationnel ?",
  "answers": [
      {
          text: "Fournir un traitement médical immédiat",
          isCorrect: false,
          comment: "L'objectif principal est d'établir un contact et un dialogue."
      },
      {
          text: "Établir un contact et un dialogue",
          isCorrect: true,
          comment: "L'abord relationnel vise à établir un contact et un dialogue avec la victime."
      },
      {
          text: "Identifier les responsabilités légales",
          isCorrect: false,
          comment: "Bien que cela soit important, ce n'est pas l'objectif principal de l'abord relationnel."
      },
      {
          text: "Ignorer les émotions de la victime",
          isCorrect: false,
          comment: "L'abord relationnel implique de reconnaître et de prendre en compte les émotions de la victime."
      }
  ]
},
{
  "text": "Comment devrait-on aborder la victime lors d'une intervention ?",
  "answers": [
      {
          text: "En évitant tout contact direct",
          isCorrect: false,
          comment: "Un contact direct est souvent nécessaire pour établir une relation de confiance."
      },
      {
          text: "En changeant fréquemment d'interlocuteur",
          isCorrect: false,
          comment: "Cela peut induire de la confusion chez la victime. Un interlocuteur principal est préférable."
      },
      {
          text: "En privilégiant un interlocuteur principal et en s'identifiant",
          isCorrect: true,
          comment: "Cela permet d'établir une communication claire et de construire une relation de confiance."
      },
      {
          text: "En ignorant les signes d'émotion de la victime",
          isCorrect: false,
          comment: "Il est important de reconnaître et de prendre en compte les émotions de la victime."
      }
  ]
},
{
  "text": "Pourquoi est-il important de prendre le temps de se présenter à la victime ?",
  "answers": [
      {
          text: "Pour laisser la victime dans l'incertitude",
          isCorrect: false,
          comment: "Cela peut augmenter l'anxiété de la victime. La clarté est préférable."
      },
      {
          text: "Pour établir un rapport de confiance",
          isCorrect: true,
          comment: "Se présenter permet d'établir un rapport de confiance et de réduire l'anxiété de la victime."
      },
      {
          text: "Pour accélérer l'intervention médicale",
          isCorrect: false,
          comment: "Bien que l'intervention rapide soit importante, la confiance est également essentielle."
      },
      {
          text: "Pour minimiser l'importance de la situation",
          isCorrect: false,
          comment: "Minimiser la situation peut invalider les émotions de la victime."
      }
  ]
},



{
  "text": "Quelle question est recommandée pour instaurer le dialogue avec la victime ?",
  "answers": [
      {
          text: "Avez-vous besoin d'une assistance médicale immédiate?",
          isCorrect: false,
          comment: "Cette question peut être trop directe et ne pas encourager le dialogue."
      },
      {
          text: "Quel est votre nom?",
          isCorrect: false,
          comment: "Cette question peut sembler superficielle au début de l'intervention."
      },
      {
          text: "Pouvez-vous me dire ce qu'il se passe?",
          isCorrect: true,
          comment: "Cette question encourage la victime à partager son expérience et à ouvrir le dialogue."
      },
      {
          text: "Pourquoi êtes-vous ici?",
          isCorrect: false,
          comment: "Cette question peut être perçue comme accusatrice ou jugementale."
      }
  ]
},
{
  "text": "Quelle est l'étape suivante après avoir posé le cadre de l'intervention ?",
  "answers": [
      {
          text: "Transporter immédiatement la victime à l'hôpital",
          isCorrect: false,
          comment: "Informer et expliquer ce qui va être réalisé est souvent la prochaine étape."
      },
      {
          text: "Explorer les loisirs de la victime",
          isCorrect: false,
          comment: "Cela peut sembler inapproprié ou déplacé dans ce contexte."
      },
      {
          text: "Informer et expliquer ce qui va être réalisé",
          isCorrect: true,
          comment: "Cette étape permet à la victime de comprendre le processus et de se sentir en contrôle."
      },
      {
          text: "Demander à la victime de quitter les lieux",
          isCorrect: false,
          comment: "Cela peut être précipité et ne pas répondre aux besoins de la victime."
      }
  ]
},
{
  "text": "Pourquoi est-il important de reformuler ce que la victime a exprimé ?",
  "answers": [
      {
          text: "Pour laisser la victime dans la confusion",
          isCorrect: false,
          comment: "Cela peut augmenter l'anxiété de la victime. La clarification est préférable."
      },
      {
          text: "Pour vérifier la compréhension et montrer de l'empathie",
          isCorrect: true,
          comment: "Reformuler montre à la victime qu'elle est entendue et comprise, ce qui renforce la relation."
      },
      {
          text: "Pour minimiser l'importance de ses propos",
          isCorrect: false,
          comment: "Cela peut invalider les émotions de la victime et nuire à la relation."
      },
      {
          text: "Pour éviter toute communication supplémentaire",
          isCorrect: false,
          comment: "La communication supplémentaire peut être nécessaire pour clarifier les informations."
      }
  ]
},
{
  "text": "Comment peut-on favoriser la relation avec la victime ?",
  "answers": [
      {
          text: "En lui demandant de quitter les lieux",
          isCorrect: false,
          comment: "Cela peut être perçu comme insensible et ne répond pas aux besoins de la victime."
      },
      {
          text: "En ignorant ses besoins et préférences",
          isCorrect: false,
          comment: "Cela peut compromettre la relation et la confiance de la victime envers les soignants."
      },
      {
          text: "En impliquant la victime dans sa propre prise en charge",
          isCorrect: true,
          comment: "Impliquer la victime dans les décisions concernant son propre soin renforce son autonomie et son empowerment."
      },
      {
          text: "En faisant des promesses impossibles à tenir",
          isCorrect: false,
          comment: "Cela peut créer de la frustration et de la méfiance chez la victime."
      }
  ]
},
{
  "text": "Quelle est l'étape finale avant de passer le relais à une autre équipe ?",
  "answers": [
      {
          text: "Ignorer la victime et partir",
          isCorrect: false,
          comment: "Cela va à l'encontre du principe de fournir un soutien et un suivi appropriés."
      },
      {
          text: "Préparer le passage de relais",
          isCorrect: true,
          comment: "Préparer le passage de relais assure une transition fluide et un suivi adéquat de la victime."
      },
      {
          text: "Rester avec la victime indéfiniment",
          isCorrect: false,
          comment: "Cela peut être inapproprié et ne répond pas toujours aux besoins de la victime."
      },
      {
          text: "Refuser toute aide supplémentaire",
          isCorrect: false,
          comment: "Cela va à l'encontre du principe de fournir un soutien complet à la victime."
      }
  ]
},
{
  "text": "Comment devrait-on saluer la victime à la fin de l'intervention ?",
  "answers": [
      {
          text: "En lui souhaitant une bonne continuation et en prenant congé",
          isCorrect: true,
          comment: "Saluer la victime de manière respectueuse et chaleureuse aide à conclure l'interaction de manière positive."
      },
      {
          text: "En lui demandant de ne pas contacter d'autres personnes pour obtenir du soutien",
          isCorrect: false,
          comment: "Cela peut limiter les ressources de soutien de la victime et ne pas respecter son autonomie."
      },
      {
          text: "En lui rappelant les détails de l'intervention",
          isCorrect: false,
          comment: "Cela peut sembler intrusif et ne pas aider à la fin de l'interaction."
      },
      {
          text: "En minimisant l'impact de la situation sur sa vie",
          isCorrect: false,
          comment: "Cela peut invalider les émotions de la victime et ne pas reconnaître son vécu."
      }
  ]
},
{
  "text": "Quel est le ton général recommandé lors de l'interaction avec la victime ?",
  "answers": [
      {
          text: "Froid et distancié",
          isCorrect: false,
          comment: "Cela peut créer une barrière entre le soignant et la victime, compromettant la relation."
      },
      {
          text: "Calme et rassurant",
          isCorrect: true,
          comment: "Un ton calme et rassurant peut aider à apaiser la victime et à établir une relation de confiance."
      },
      {
          text: "Pressé et impatient",
          isCorrect: false,
          comment: "Cela peut augmenter l'anxiété de la victime et compromettre la qualité de l'interaction."
      },
      {
          text: "Critique et blâmant",
          isCorrect: false,
          comment: "Cela peut nuire à l'estime de soi de la victime et ne pas favoriser un environnement de soutien."
      }
  ]
},
{
  "text": "Quelles sont les deux catégories de victimes parmi les enfants dans une situation de secours ?",
  "answers": [
      {
          text: "Victime primaire et victime secondaire",
          isCorrect: true,
          comment: "Ces deux catégories décrivent les enfants directement affectés par la situation d'urgence et ceux indirectement touchés."
      },
      {
          text: "Victime tertiaire et victime quaternaire",
          isCorrect: false,
          comment: "Ces catégories décrivent généralement les personnes touchées par les conséquences à plus long terme d'une urgence."
      },
      {
          text: "Victime principale et victime accessoire",
          isCorrect: false,
          comment: "Ces termes ne sont pas couramment utilisés pour décrire les catégories de victimes chez les enfants lors d'une intervention d'urgence."
      },
      {
          text: "Victime prioritaire et victime secondaire",
          isCorrect: false,
          comment: "Ces termes ne sont pas utilisés pour décrire les catégories de victimes chez les enfants lors d'une intervention d'urgence."
      }
  ]
},

{
  "text": "Comment devrait-on adapter sa communication lorsqu'on intervient auprès d'un enfant ?",
  "answers": [
      {
          text: "En utilisant un ton froid et distant",
          isCorrect: false,
          comment: "Un ton froid et distant peut intimider l'enfant et rendre la communication moins efficace."
      },
      {
          text: "En parlant uniquement avec des mots compliqués",
          isCorrect: false,
          comment: "L'utilisation de mots compliqués peut rendre la communication confuse pour l'enfant, il est préférable d'utiliser un langage simple et adapté à son âge."
      },
      {
          text: "En s'adressant directement à l'enfant et en utilisant des mots simples et honnêtes",
          isCorrect: true,
          comment: "C'est la meilleure approche pour établir une communication efficace avec un enfant pendant une intervention."
      },
      {
          text: "En évitant tout contact visuel avec l'enfant",
          isCorrect: false,
          comment: "Le contact visuel est important pour établir une connexion émotionnelle avec l'enfant, il ne devrait pas être évité."
      }
  ]
},

{
  "text": "Que devrait éviter de faire le secouriste tout au long de l'intervention auprès de l'enfant ?",
  "answers": [
      {
          text: "Dire la vérité sur la gravité de la situation",
          isCorrect: false,
          comment: "La transparence est importante pour établir la confiance avec l'enfant, donc mentir ne devrait jamais être une option."
      },
      {
          text: "Obliger l'enfant à parler",
          isCorrect: false,
          comment: "Forcer l'enfant à parler peut augmenter son stress et rendre l'interaction plus difficile, il est préférable de lui permettre de s'exprimer à son propre rythme."
      },
      {
          text: "Banaliser ou dramatiser la situation",
          isCorrect: true,
          comment: "Banaliser la situation peut minimiser les sentiments de l'enfant, tandis que dramatiser peut aggraver son anxiété, il est important de maintenir un équilibre et de fournir un soutien approprié."
      },
      {
          text: "Encourager les attitudes héroïques",
          isCorrect: false,
          comment: "Encourager les attitudes héroïques peut mettre trop de pression sur l'enfant et aggraver son stress, il est préférable de fournir un soutien et un réconfort."
      }
  ]
},
{
  "text": "Quelle attitude le secouriste devrait-il adopter envers les émotions de l'enfant ?",
  "answers": [
      {
          text: "Les ignorer complètement",
          isCorrect: false,
          comment: "Ignorer les émotions de l'enfant peut lui faire sentir qu'il n'est pas écouté ou compris, ce qui peut aggraver son stress."
      },
      {
          text: "Encourager les attitudes héroïques",
          isCorrect: false,
          comment: "Encourager les attitudes héroïques peut mettre trop de pression sur l'enfant et l'empêcher d'exprimer ses véritables émotions."
      },
      {
          text: "Accepter ses réactions normales et l'autoriser à exprimer ses émotions",
          isCorrect: true,
          comment: "C'est important pour aider l'enfant à se sentir compris et soutenu pendant une situation stressante."
      },
      {
          text: "Menacer de quitter la situation",
          isCorrect: false,
          comment: "Menacer de quitter la situation peut aggraver l'anxiété de l'enfant et lui faire sentir qu'il est abandonné, ce qui n'est pas approprié."
      }
  ]
},
{
  "text": "Pourquoi est-il important de ne pas mentir à l'enfant pendant l'intervention ?",
  "answers": [
      {
          text: "Pour éviter de le perturber davantage",
          isCorrect: true,
          comment: "La transparence est importante pour établir la confiance avec l'enfant et minimiser son anxiété."
      },
      {
          text: "Pour minimiser l'importance de la situation",
          isCorrect: false,
          comment: "Minimiser la situation peut faire sentir à l'enfant que ses sentiments ne sont pas pris au sérieux, ce qui peut aggraver son stress."
      },
      {
          text: "Pour faire preuve d'autorité",
          isCorrect: false,
          comment: "La confiance et le soutien sont plus importants que l'autorité dans ce contexte, donc mentir ne devrait pas être utilisé comme un moyen de montrer l'autorité."
      },
      {
          text: "Pour impressionner les parents",
          isCorrect: false,
          comment: "L'objectif principal devrait être le bien-être de l'enfant, pas l'impression des parents, donc mentir ne devrait jamais être une option."
      }
  ]
},

{
  text: "Quels sont les risques psychologiques principaux auxquels est exposé le secouriste dans son activité ?",
  answers: [
      {
          text: "Fatigue physique et sentiment de déshumanisation",
          isCorrect: false,
          comment: "Bien que la fatigue physique puisse être un risque, le principal risque est lié au stress, au traumatisme, à l'usure et à l'épuisement."
      },
      {
          text: "Troubles du sommeil et dépression",
          isCorrect: false,
          comment: "Bien que ces problèmes puissent survenir, ils ne couvrent pas tous les risques psychologiques auxquels est exposé un secouriste."
      },
      {
          text: "Stress, traumatisme, usure et épuisement",
          isCorrect: true,
          comment: "Ces risques sont souvent associés aux activités de secours en raison de la nature des situations auxquelles les secouristes sont confrontés."
      },
      {
          text: "Sentiment d'accomplissement personnel et motivation",
          isCorrect: false,
          comment: "Bien que le sentiment d'accomplissement puisse être une partie de l'expérience, il ne couvre pas tous les risques psychologiques."
      }
  ]
},
{
  text: "Quelle est la réaction immédiate de stress qui permet au secouriste de mobiliser ses ressources pour accomplir sa mission ?",
  answers: [
      {
          text: "Fuite",
          isCorrect: false,
          comment: "La fuite n'est pas une réaction de stress productive pour un secouriste, elle peut compromettre sa capacité à accomplir sa mission."
      },
      {
          text: "Action automatique",
          isCorrect: false,
          comment: "Bien que l'action automatique puisse se produire, ce n'est pas la réaction immédiate de stress qui permet au secouriste de mobiliser ses ressources."
      },
      {
          text: "Sidération",
          isCorrect: false,
          comment: "La sidération peut paralyser le secouriste, ce qui compromettrait sa capacité à agir efficacement en situation d'urgence."
      },
      {
          text: "Focalisation d'attention",
          isCorrect: true,
          comment: "La focalisation de l'attention permet au secouriste de se concentrer sur la tâche à accomplir malgré le stress, ce qui est essentiel pour une intervention réussie."
      }
  ]
},
{
  text: "Quels sont les symptômes principaux d'un trouble de stress aigu chez un secouriste ?",
  answers: [
      {
          text: "Répétition de l'événement initial et évitement des situations similaires",
          isCorrect: false,
          comment: "Ces symptômes sont plus associés au trouble de stress post-traumatique (TSPT) qu'au trouble de stress aigu."
      },
      {
          text: "Conduites d'hypervigilance et pensées négatives",
          isCorrect: false,
          comment: "Bien que ces symptômes puissent se produire, ils ne sont pas spécifiques au trouble de stress aigu."
      },
      {
          text: "Flashbacks et réactions de sidération",
          isCorrect: true,
          comment: "Ces symptômes sont caractéristiques du trouble de stress aigu, qui survient dans les jours ou les semaines suivant un événement traumatique."
      },
      {
          text: "Sentiment d'accomplissement personnel et adaptation à la situation",
          isCorrect: false,
          comment: "Le sentiment d'accomplissement personnel et l'adaptation ne sont pas des symptômes d'un trouble de stress aigu, mais plutôt des aspects positifs de l'expérience professionnelle."
      }
  ]
},
{
  text: "Qu'est-ce que le traumatisme vicariant ?",
  answers: [
      {
          text: "Un trouble psychologique développé par les victimes",
          isCorrect: false,
          comment: "Le traumatisme vicariant n'est pas développé par les victimes, mais par les professionnels qui sont exposés aux traumatismes des autres."
      },
      {
          text: "Une forme de traumatisme direct vécu par le secouriste",
          isCorrect: false,
          comment: "Le traumatisme vicariant est une forme de traumatisme indirect qui résulte de l'exposition aux traumatismes des autres, pas du vécu direct du secouriste."
      },
      {
          text: "Une conviction d'un monde dangereux développée par le secouriste",
          isCorrect: true,
          comment: "Le traumatisme vicariant peut conduire le secouriste à développer une vision du monde comme étant intrinsèquement dangereux ou menaçant."
      },
      {
          text: "Un symptôme de stress aigu chez le secouriste",
          isCorrect: false,
          comment: "Le traumatisme vicariant est distinct du stress aigu, bien qu'ils puissent être liés dans certaines situations."
      }
  ]
},
{
  text: "Quels sont les symptômes d'un épuisement professionnel (burn-out) chez le secouriste ?",
  answers: [
      {
          text: "Épuisement émotionnel, déshumanisation et sentiment de non-accomplissement personnel",
          isCorrect: true,
          comment: "Ces symptômes sont caractéristiques de l'épuisement professionnel, qui résulte d'un stress chronique lié au travail."
      },
      {
          text: "Insensibilité aux émotions, cynisme et vision positive des autres",
          isCorrect: false,
          comment: "Ces symptômes sont associés au cynisme, mais pas nécessairement à l'épuisement professionnel."
      },
      {
          text: "Perte d'estime de soi, manque de ressources émotionnelles et engagement professionnel",
          isCorrect: false,
          comment: "Ces symptômes peuvent être associés à l'épuisement professionnel, mais ils ne le définissent pas entièrement."
      },
      {
          text: "Perte d'idéal du métier et sentiment d'échec",
          isCorrect: false,
          comment: "Ces symptômes peuvent être présents dans l'épuisement professionnel, mais ils ne sont pas les seuls ni les plus spécifiques."
      }
  ]
},

{
  text: "Quelle est l'une des compétences indissociables pour être efficace en tant que secouriste ?",
  answers: [
      {
          text: "Connaissance approfondie des protocoles médicaux",
          isCorrect: false,
          comment: "La connaissance des protocoles médicaux est importante, mais elle n'est pas indissociable pour être efficace en tant que secouriste."
      },
      {
          text: "Condition physique optimale",
          isCorrect: true,
          comment: "Une bonne condition physique est essentielle pour répondre efficacement aux situations d'urgence et pour assurer sa propre sécurité."
      },
      {
          text: "SST",
          isCorrect: false,
          comment: "La capacité à prendre des décisions rapides est importante, mais elle peut être compromise en l'absence d'une condition physique optimale."
      },
      {
          text: "Sensibilité émotionnelle",
          isCorrect: false,
          comment: "La sensibilité émotionnelle peut être utile dans certaines situations, mais elle n'est pas indissociable pour être efficace en tant que secouriste."
      }
  ]
},
{
  text: "Quelles sont les mesures recommandées pour préserver l'opérationnalité mentale du secouriste ?",
  answers: [
      {
          text: "Éviter les situations stressantes et émotionnelles",
          isCorrect: false,
          comment: "Éviter les situations stressantes et émotionnelles peut être difficile voire impossible dans le cadre des activités de secours."
      },
      {
          text: "Suivre un régime alimentaire strict et équilibré",
          isCorrect: false,
          comment: "Un régime alimentaire équilibré est important pour la santé, mais il ne suffit pas à préserver l'opérationnalité mentale du secouriste."
      },
      {
          text: "Appliquer des techniques de gestion du stress et soigner son hygiène de vie",
          isCorrect: true,
          comment: "La gestion du stress et une bonne hygiène de vie sont essentielles pour préserver l'opérationnalité mentale du secouriste face aux défis professionnels."
      },
      {
          text: "Se concentrer uniquement sur les aspects techniques de la mission",
          isCorrect: false,
          comment: "Se concentrer uniquement sur les aspects techniques peut négliger les aspects émotionnels et relationnels des interventions, ce qui peut compromettre l'efficacité du secouriste."
      }
  ]
},
{
  text: "Que devrait faire le secouriste si l'un des membres de l'équipe présente des signes inhabituelles pendant une intervention?",
  answers: [
      {
          text: "Ignorer les signes et poursuivre la mission",
          isCorrect: false,
          comment: "Ignorer les signes de détresse d'un membre de l'équipe peut aggraver la situation et compromettre la sécurité de tous les membres."
      },
      {
          text: "Informer le chef d'équipe pour ajuster la mission",
          isCorrect: true,
          comment: "Il est important de signaler tout signe de détresse ou de manifestations inhabituelles à la hiérarchie afin d'adapter la mission en conséquence et de fournir un soutien approprié."
      },
      {
          text: "Blâmer le membre de l'équipe pour son comportement",
          isCorrect: false,
          comment: "Blâmer un membre de l'équipe pour des manifestations inhabituelles peut aggraver sa détresse et compromettre le fonctionnement de l'équipe."
      },
      {
          text: "Demander à l'équipe de se disperser et de se reposer",
          isCorrect: false,
          comment: "Demander à l'équipe de se disperser peut compromettre la coordination et l'efficacité de l'intervention, surtout si des manifestations inhabituelles surviennent chez plusieurs membres de l'équipe."
      }
  ]
},
{
  text: "Qu'est-ce qui peut nécessiter une orientation vers une aide professionnelle spécialisée pour un secouriste ?",
  answers: [
      {
          text: "Une réaction immédiate de stress",
          isCorrect: false,
          comment: "Une réaction immédiate de stress est normale dans certaines situations et ne nécessite pas nécessairement une aide professionnelle spécialisée à moins qu'elle ne persiste ou s'aggrave."
      },
      {
          text: "Une diminution des capacités de réflexe",
          isCorrect: false,
          comment: "Une diminution des capacités de réflexe peut être un signe de fatigue ou de stress, mais cela ne nécessite pas nécessairement une aide professionnelle spécialisée à moins que cela n'interfère avec la capacité de travailler efficacement."
      },
      {
          text: "Un sentiment d'accomplissement personnel",
          isCorrect: false,
          comment: "Un sentiment d'accomplissement personnel est positif et ne nécessite pas une orientation vers une aide professionnelle spécialisée."
      },
      {
          text: "Des signes de souffrance psychologique",
          isCorrect: true,
          comment: "Des signes de souffrance psychologique tels que des symptômes de stress prolongés, des troubles du sommeil ou des difficultés relationnelles peuvent nécessiter une orientation vers une aide professionnelle spécialisée pour aider le secouriste à faire face à ces défis."
      }
  ]
},
{
  text: "Quel est l'objectif de l'appui psychologique précoce et approprié pour un secouriste ?",
  answers: [
      {
          text: "Améliorer ses performances physiques",
          isCorrect: false,
          comment: "L'appui psychologique n'est pas principalement axé sur l'amélioration des performances physiques, mais sur la gestion du stress et la prévention des troubles psychologiques."
      },
      {
          text: "Faciliter sa récupération sur les plans personnels et professionnels",
          isCorrect: true,
          comment: "L'objectif de l'appui psychologique précoce et approprié est de soutenir le secouriste dans sa récupération physique et émotionnelle après des situations stressantes, afin de préserver sa santé mentale et son bien-être général."
      },
      {
          text: "Minimiser son engagement émotionnel dans les interventions",
          isCorrect: false,
          comment: "L'appui psychologique ne vise pas à minimiser l'engagement émotionnel, mais à aider le secouriste à gérer efficacement ses réactions émotionnelles dans le cadre de son travail."
      },
      {
          text: "Favoriser une vision optimiste de son métier",
          isCorrect: false,
          comment: "L'appui psychologique peut aider le secouriste à maintenir une perspective réaliste sur son métier et à développer des stratégies pour faire face aux défis professionnels, mais il ne vise pas nécessairement à favoriser une vision optimiste à tout prix."
      }
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
