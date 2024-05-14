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
  "text": "Quelle question est recommandée pour instaurer le dialogue avec la victime?",
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
  "text": "Quelle est l'étape suivante après avoir posé le cadre de l'intervention?",
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
  "text": "Pourquoi est-il important de reformuler ce que la victime a exprimé?",
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
  "text": "Comment peut-on favoriser l'alliance avec la victime?",
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
  "text": "Quelle est l'étape finale avant de passer le relais à une autre équipe?",
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
  "text": "Comment peut-on évaluer la douleur chez un enfant?",
  "answers": [
      {
          text: "En lui posant des questions complexes sur ses sensations",
          isCorrect: false,
          comment: "Les questions complexes peuvent être difficiles à comprendre pour un enfant et peuvent ne pas donner une évaluation précise de sa douleur."
      },
      {
          text: "En se basant uniquement sur ses pleurs",
          isCorrect: false,
          comment: "Les pleurs peuvent être un indicateur de douleur, mais ils ne sont pas toujours fiables car certains enfants peuvent ne pas pleurer même s'ils ressentent de la douleur."
      },
      {
          text: "En utilisant des échelles d'auto-évaluation adaptées à son âge",
          isCorrect: true,
          comment: "Les échelles d'auto-évaluation sont souvent utilisées pour évaluer la douleur chez les enfants, en leur demandant de choisir un visage ou une expression qui correspond à ce qu'ils ressentent."
      },
      {
          text: "En lui donnant des médicaments sans poser de questions",
          isCorrect: false,
          comment: "Administrer des médicaments sans évaluation appropriée de la douleur peut être dangereux et ne devrait pas être fait sans supervision médicale."
      }
  ]
},
{
  "text": "Pourquoi l'utilisation d'une peluche est-elle recommandée lors de l'intervention auprès d'un enfant?",
  "answers": [
      {
          text: "Pour distraire l'enfant et le faire rire",
          isCorrect: false,
          comment: "Bien que la distraction soit un aspect de l'utilisation de la peluche, ce n'est pas sa seule raison d'être recommandée."
      },
      {
          text: "Pour remplacer la présence des parents",
          isCorrect: false,
          comment: "La peluche ne peut pas remplacer la présence des parents, mais elle peut offrir un soutien émotionnel supplémentaire à l'enfant pendant une situation stressante."
      },
      {
          text: "Pour faciliter la prise de contact et créer un lien avec l'enfant",
          isCorrect: true,
          comment: "La peluche peut être utilisée pour établir une relation de confiance avec l'enfant et rendre l'interaction plus confortable."
      },
      {
          text: "Pour effrayer davantage l'enfant",
          isCorrect: false,
          comment: "L'intention de l'intervention est de réconforter l'enfant, non de l'effrayer davantage, donc la peluche ne devrait pas être utilisée dans ce but."
      }
  ]
},
{
  "text": "Quel est l'objectif principal de l'utilisation de la peluche pendant l'intervention?",
  "answers": [
      {
          text: "Effrayer l'enfant pour qu'il coopère davantage",
          isCorrect: false,
          comment: "L'objectif principal est d'établir une relation de confiance et de rendre l'interaction plus confortable pour l'enfant, pas de l'effrayer davantage."
      },
      {
          text: "Distraire l'enfant pendant les gestes de secourisme",
          isCorrect: false,
          comment: "Bien que la distraction puisse être un effet secondaire, ce n'est pas l'objectif principal de l'utilisation de la peluche."
      },
      {
          text: "Faciliter la communication entre le secouriste et l'enfant",
          isCorrect: true,
          comment: "La peluche peut servir de médiateur pour faciliter la communication et établir une relation de confiance entre le secouriste et l'enfant."
      },
      {
          text: "Remplacer la présence des parents",
          isCorrect: false,
          comment: "Rien ne peut remplacer la présence des parents pour l'enfant, mais la peluche peut offrir un soutien émotionnel supplémentaire pendant une situation stressante."
      }
  ]
},
{
  "text": "Pourquoi est-il important de prendre en compte les signes de détresse psychologique chez une victime selon le texte?",
  "answers": [
      {
          text: "Pour minimiser les répercussions physiques à court terme",
          isCorrect: false,
          comment: "Les signes de détresse psychologique sont importants à prendre en compte non seulement pour les répercussions physiques, mais aussi pour les répercussions émotionnelles à court et à long terme."
      },
      {
          text: "Pour faciliter le travail des secouristes en les informant des manifestations émotionnelles",
          isCorrect: false,
          comment: "Bien que cela puisse aider les secouristes à comprendre l'état émotionnel de la victime, la prise en compte des signes de détresse psychologique vise principalement à limiter les répercussions négatives à court et long terme pour la victime elle-même."
      },
      {
          text: "Pour éviter des complications dans l'évaluation de la situation médicale",
          isCorrect: false,
          comment: "La prise en compte des signes de détresse psychologique n'a pas pour objectif principal d'éviter des complications dans l'évaluation médicale, mais plutôt de répondre aux besoins émotionnels de la victime."
      },
      {
          text: "Pour limiter les répercussions négatives à court et long terme",
          isCorrect: true,
          comment: "C'est l'objectif principal de la prise en compte des signes de détresse psychologique chez une victime, car cela peut aider à réduire les conséquences émotionnelles à court et à long terme."
      }
  ]
},
{
  "text": "Quel impact l'expression du visage et le regard d'une personne peuvent-ils avoir sur l'évaluation de son état affectif selon le texte?",
  "answers": [
      {
          text: "Aucun, car ces éléments sont souvent trompeurs",
          isCorrect: false,
          comment: "L'expression faciale et le regard peuvent fournir des indications importantes sur l'état émotionnel d'une personne, bien que cela puisse varier d'une personne à l'autre."
      },
      {
          text: "Ils peuvent révéler des émotions et des états affectifs",
          isCorrect: true,
          comment: "L'expression faciale et le regard peuvent en effet fournir des indices sur les émotions et les états affectifs d'une personne, aidant ainsi à comprendre son état émotionnel."
      },
      {
          text: "Ils indiquent toujours une détresse psychologique",
          isCorrect: false,
          comment: "Bien que l'expression faciale et le regard puissent indiquer une détresse psychologique chez certaines personnes, ce n'est pas toujours le cas pour tout le monde."
      },
      {
          text: "Ils sont uniquement utiles pour évaluer les blessures visibles",
          isCorrect: false,
          comment: "L'expression faciale et le regard peuvent fournir des informations sur l'état émotionnel d'une personne, mais ils ne sont pas spécifiquement liés à l'évaluation des blessures visibles."
      }
  ]
},
{
  "text": "Qu'est-ce que l'hypervigilance, mentionnée dans le texte, peut indiquer chez une victime?",
  "answers": [
      {
          text: "Une conscience claire de la situation",
          isCorrect: false,
          comment: "L'hypervigilance ne se manifeste pas nécessairement par une conscience claire de la situation, mais plutôt par une vigilance excessive et une réaction exagérée aux stimuli environnementaux."
      },
      {
          text: "Un état de désorientation temporelle et spatiale",
          isCorrect: true,
          comment: "L'hypervigilance peut entraîner une désorientation temporelle et spatiale chez une victime, car elle peut être tellement concentrée sur la recherche de menaces potentielles qu'elle perd le contact avec la réalité environnante."
      },
      {
          text: "Une attitude généralement calme et coopérante",
          isCorrect: false,
          comment: "L'hypervigilance se caractérise plutôt par une vigilance excessive et une réaction exagérée, ce qui est souvent en contradiction avec une attitude calme et coopérante."
      },
      {
          text: "Une augmentation de la perception de la douleur",
          isCorrect: false,
          comment: "Bien que l'hypervigilance puisse être associée à une sensibilité accrue aux stimuli environnementaux, elle n'entraîne pas nécessairement une augmentation de la perception de la douleur."
      }
  ]
},
{
  "text": "Quels éléments doivent être pris en compte lors de l'évaluation de l'état de conscience d'une victime, selon le texte?",
  "answers": [
      {
          text: "La mémoire et la gestuelle",
          isCorrect: false,
          comment: "Bien que la mémoire et la gestuelle puissent être des indicateurs importants, l'évaluation de l'état de conscience se concentre principalement sur le comportement et le langage de la victime."
      },
      {
          text: "Le comportement et le langage",
          isCorrect: true,
          comment: "Le comportement et le langage sont des éléments clés de l'évaluation de l'état de conscience d'une victime, car ils peuvent fournir des informations sur sa réactivité et sa capacité à interagir avec son environnement."
      },
      {
          text: "La gestuelle et la vigilance",
          isCorrect: false,
          comment: "Bien que la gestuelle et la vigilance puissent être des aspects pertinents de l'évaluation de l'état de conscience, elles ne sont pas aussi directement liées que le comportement et le langage."
      },
      {
          text: "Le jugement et le raisonnement",
          isCorrect: false,
          comment: "Le jugement et le raisonnement peuvent être affectés par l'état de conscience d'une victime, mais ils ne sont pas les principaux éléments pris en compte lors de son évaluation initiale."
      }
  ]
},
{
  "text": "Quel est l'objectif de l'observation et du questionnement du secouriste selon le texte?",
  "answers": [
      {
          text: "Identifier les blessures visibles",
          isCorrect: false,
          comment: "Bien que l'identification des blessures puisse être une partie importante de l'évaluation médicale, l'objectif principal de l'observation et du questionnement est d'évaluer l'état émotionnel et psychologique de la victime."
      },
      {
          text: "Recueillir des informations sur l'histoire médicale de la victime",
          isCorrect: false,
          comment: "Bien que cela puisse être pertinent dans certains cas, l'observation et le questionnement visent principalement à évaluer l'état émotionnel et psychologique de la victime immédiatement après un événement stressant."
      },
      {
          text: "Évaluer l'état émotionnel et psychologique de la victime",
          isCorrect: true,
          comment: "L'observation et le questionnement sont utilisés par le secouriste pour évaluer l'état émotionnel et psychologique de la victime, ce qui peut aider à déterminer les besoins immédiats en termes de soutien et d'intervention."
      },
      {
          text: "Évaluer la gravité des blessures",
          isCorrect: false,
          comment: "Bien que cela puisse être nécessaire dans certains cas, l'objectif principal de l'observation et du questionnement est d'évaluer l'état émotionnel et psychologique de la victime plutôt que la gravité de ses blessures."
      }
  ]
},
{
  "text": "Quel est l'objectif principal de la stabilisation de la victime lors de l'action de secours?",
  "answers": [
      {
          text: "Réduire la durée totale de l'intervention médicale",
          isCorrect: false,
          comment: "La stabilisation de la victime vise principalement à limiter les effets nocifs physiologiques et psychologiques du stress, plutôt qu'à réduire la durée totale de l'intervention médicale."
      },
      {
          text: "Augmenter la détresse psychologique de la victime",
          isCorrect: false,
          comment: "L'objectif de la stabilisation de la victime n'est pas d'augmenter sa détresse psychologique, mais plutôt de la réduire en limitant les effets nocifs du stress."
      },
      {
          text: "Limiter les effets nocifs physiologiques et psychologiques du stress",
          isCorrect: true,
          comment: "La stabilisation de la victime vise à limiter les effets nocifs du stress, à la fois sur le plan physiologique et psychologique, pour favoriser une meilleure récupération."
      },
      {
          text: "Améliorer la communication entre le secouriste et la victime",
          isCorrect: false,
          comment: "Bien que la communication puisse être un élément important de l'intervention, l'objectif principal de la stabilisation de la victime est de limiter les effets nocifs du stress."
      }
  ]
},
{
  "text": "Quels sont les canaux de communication utilisés par le secouriste pour focaliser l'attention de la victime?",
  "answers": [
      {
          text: "Le canal olfactif, le toucher et la parole",
          isCorrect: false,
          comment: "Les canaux de communication utilisés pour focaliser l'attention de la victime incluent principalement le canal auditif, kinesthésique et visuel, qui permettent une communication efficace même dans des situations stressantes."
      },
      {
          text: "Le canal auditif, kinesthésique et visuel",
          isCorrect: true,
          comment: "Ces canaux de communication permettent une communication efficace avec la victime, en utilisant à la fois l'audition, le mouvement corporel et la vision pour focaliser son attention."
      },
      {
          text: "Le canal kinesthésique, la respiration et le regard",
          isCorrect: false,
          comment: "Bien que certains de ces éléments puissent être utilisés dans la communication, les principaux canaux pour focaliser l'attention de la victime sont l'auditif, le kinesthésique et le visuel."
      },
      {
          text: "Le canal visuel, la pensée et la respiration",
          isCorrect: false,
          comment: "Ces éléments peuvent être importants dans certaines situations, mais ils ne sont pas les canaux principaux utilisés par le secouriste pour focaliser l'attention de la victime."
      }
  ]
},
{
  "text": "Pourquoi le secouriste propose-t-il à la victime de fixer un point devant elle?",
  "answers": [
      {
          text: "Pour aider la victime à se concentrer sur la respiration",
          isCorrect: false,
          comment: "Le fait de fixer un point devant la victime vise principalement à éviter qu'elle ne panique davantage en voyant des éléments visuels négatifs, plutôt qu'à se concentrer sur la respiration."
      },
      {
          text: "Pour éviter que la victime ne panique davantage en voyant des éléments visuels négatifs",
          isCorrect: true,
          comment: "En encourageant la victime à fixer un point devant elle, le secouriste cherche à éviter qu'elle ne panique davantage en se concentrant sur des éléments visuels négatifs qui pourraient aggraver sa détresse émotionnelle."
      },
      {
          text: "Pour encourager la victime à parler de ses sentiments",
          isCorrect: false,
          comment: "Bien que cela puisse être utile dans certains contextes, le but principal de proposer à la victime de fixer un point devant elle est de réduire sa panique en évitant les stimuli visuels négatifs."
      },
      {
          text: "Pour distraire la victime de la situation actuelle",
          isCorrect: false,
          comment: "La fixation d'un point devant la victime n'a pas pour but de la distraire de la situation actuelle, mais plutôt de la calmer en évitant les stimuli visuels négatifs."
      }
  ]
},
{
  "text": "Quel est le but du code de communication établi entre le secouriste et la victime?",
  "answers": [
      {
          text: "Faciliter la coordination entre les secouristes",
          isCorrect: false,
          comment: "Le but principal du code de communication est d'assurer une communication claire entre le secouriste et la victime lorsque la parole est impossible, plutôt que de faciliter la coordination entre les secouristes."
      },
      {
          text: "Permettre à la victime de choisir son traitement médical",
          isCorrect: false,
          comment: "Bien que cela puisse être pertinent dans certaines situations, le code de communication est principalement utilisé pour assurer une communication claire lorsque la parole est impossible, plutôt que de permettre à la victime de choisir son traitement médical."
      },
      {
          text: "Assurer une communication claire lorsque la parole est impossible",
          isCorrect: true,
          comment: "Le code de communication est établi pour permettre une communication claire entre le secouriste et la victime, en utilisant des signaux convenus pour transmettre des informations lorsque la parole est impossible."
      },
      {
          text: "Aider la victime à se concentrer sur sa respiration",
          isCorrect: false,
          comment: "Bien que la respiration puisse être importante dans certaines situations, le but principal du code de communication est d'assurer une communication claire lorsque la parole est impossible."
      }
  ]
},
{
  "text": "Pourquoi le secouriste encourage-t-il la victime à se concentrer sur des sujets agréables pour elle?",
  "answers": [
      {
          text: "Pour rendre l'intervention médicale plus rapide",
          isCorrect: false,
          comment: "Le but de cette action n'est pas de rendre l'intervention médicale plus rapide, mais plutôt de renforcer le sentiment de contrôle de la victime et de réduire sa détresse émotionnelle."
      },
      {
          text: "Pour distraire la victime de la réalité de la situation",
          isCorrect: false,
          comment: "Bien que cela puisse être un effet secondaire, le but principal d'encourager la victime à se concentrer sur des sujets agréables est de renforcer son sentiment de contrôle et de réduire sa détresse émotionnelle."
      },
      {
          text: "Pour renforcer le sentiment de contrôle de la victime",
          isCorrect: true,
          comment: "En encourageant la victime à se concentrer sur des sujets agréables pour elle, le secouriste cherche à renforcer son sentiment de contrôle sur la situation et à réduire sa détresse émotionnelle."
      },
      {
          text: "Pour augmenter la détresse psychologique de la victime",
          isCorrect: false,
          comment: "Le but du secouriste n'est pas d'augmenter la détresse psychologique de la victime, mais plutôt de la réduire en renforçant son sentiment de contrôle et en réduisant sa détresse émotionnelle."
      }
  ]
},{
  "text": "Quel est l'objectif principal de l'écoute active lors de l'intervention d'un secouriste?",
  "answers": [
      {
          text: "Proposer des solutions aux problèmes de la victime",
          isCorrect: false,
          comment: "L'objectif de l'écoute active n'est pas de proposer des solutions, mais plutôt de renforcer positivement la participation de la victime dans la résolution de ses problèmes."
      },
      {
          text: "Juger négativement les actions de la victime pour la motiver",
          isCorrect: false,
          comment: "La critique négative n'est pas une composante de l'écoute active. L'objectif est de renforcer positivement la participation de la victime."
      },
      {
          text: "Renforcer positivement la participation de la victime",
          isCorrect: true,
          comment: "L'écoute active vise à encourager la participation active de la victime en renforçant positivement son implication dans la résolution de ses problèmes."
      },
      {
          text: "Rationaliser les réactions émotionnelles de la victime",
          isCorrect: false,
          comment: "L'objectif principal n'est pas de rationaliser les réactions émotionnelles de la victime, mais plutôt de renforcer positivement sa participation."
      }
  ]
},
{
  "text": "Qu'est-ce que la phase de 'recontextualisation' implique pour le secouriste?",
  "answers": [
      {
          text: "Offrir des conseils pour résoudre le problème de la victime",
          isCorrect: false,
          comment: "La phase de recontextualisation ne consiste pas à offrir des conseils, mais plutôt à poser des questions ouvertes pour clarifier le contexte de la situation."
      },
      {
          text: "Juger la situation de manière critique pour aider la victime à comprendre",
          isCorrect: false,
          comment: "La phase de recontextualisation n'implique pas de jugement critique, mais plutôt une compréhension approfondie de la situation par le biais de questions ouvertes."
      },
      {
          text: "Poser des questions ouvertes pour clarifier le contexte de la situation",
          isCorrect: true,
          comment: "La phase de recontextualisation consiste à poser des questions ouvertes pour clarifier le contexte de la situation, permettant ainsi une meilleure compréhension de la problématique."
      },
      {
          text: "Consoler la victime en minimisant son problème",
          isCorrect: false,
          comment: "La recontextualisation ne vise pas à minimiser le problème de la victime, mais plutôt à clarifier le contexte de la situation."
      }
  ]
},
{
  "text": "Quelle est la principale action du secouriste lors de la phase de 'reformulation'?",
  "answers": [
      {
          text: "Proposer des solutions alternatives à la victime",
          isCorrect: false,
          comment: "La reformulation ne consiste pas à proposer des solutions alternatives, mais plutôt à reprendre les propos de la victime pour clarifier leur signification."
      },
      {
          text: "Reprendre les propos de la victime pour clarifier leur signification",
          isCorrect: true,
          comment: "La principale action lors de la phase de reformulation est de reprendre les propos de la victime pour clarifier leur signification, favorisant ainsi une meilleure compréhension de ses préoccupations."
      },
      {
          text: "Faire des comparaisons avec d'autres situations similaires",
          isCorrect: false,
          comment: "La reformulation ne consiste pas à faire des comparaisons, mais plutôt à reformuler les propos de la victime pour une meilleure compréhension."
      },
      {
          text: "Consoler la victime en minimisant ses préoccupations",
          isCorrect: false,
          comment: "La reformulation ne vise pas à minimiser les préoccupations de la victime, mais plutôt à les clarifier pour une meilleure communication."
      }
  ]
},
{
  "text": "Pourquoi est-il important pour le secouriste de 'renforcer' positivement la victime?",
  "answers": [
      {
          text: "Pour rationaliser les réactions émotionnelles de la victime",
          isCorrect: false,
          comment: "Le renforcement positif n'a pas pour but de rationaliser les réactions émotionnelles de la victime, mais plutôt d'encourager sa participation active dans la résolution de ses problèmes."
      },
      {
          text: "Pour encourager la participation active de la victime dans la résolution du problème",
          isCorrect: true,
          comment: "Le renforcement positif est essentiel pour encourager la participation active de la victime dans la résolution de ses problèmes, en renforçant sa confiance et son engagement."
      },
      {
          text: "Pour minimiser les problèmes de la victime et la consoler",
          isCorrect: false,
          comment: "Le renforcement positif ne vise pas à minimiser les problèmes de la victime, mais plutôt à renforcer sa confiance et son autonomie dans la résolution de ses problèmes."
      },
      {
          text: "Pour pratiquer une pseudo-analyse de la situation",
          isCorrect: false,
          comment: "Le renforcement positif n'implique pas une pseudo-analyse de la situation, mais plutôt un soutien et un encouragement positifs pour la victime."
      }
  ]
},
{
  "text": "Quelle est la principale action à éviter pour le secouriste lors de l'écoute active?",
  "answers": [
      {
          text: "Parler de son expérience personnelle",
          isCorrect: false,
          comment: "Parler de son expérience personnelle peut parfois être utile pour établir un lien avec la victime, mais cela ne doit pas être la principale action lors de l'écoute active."
      },
      {
          text: "Consoler la victime en minimisant ses préoccupations",
          isCorrect: false,
          comment: "La consolation de la victime est importante, mais elle ne doit pas être faite en minimisant ses préoccupations. L'écoute active implique une validation des sentiments de la victime."
      },
      {
          text: "Offrir des solutions concrètes aux problèmes de la victime",
          isCorrect: true,
          comment: "Lors de l'écoute active, le secouriste doit éviter d'offrir des solutions concrètes aux problèmes de la victime. L'objectif est d'écouter activement et de renforcer positivement sa participation."
      },
      {
          text: "Juger négativement les actions de la victime",
          isCorrect: false,
          comment: "La critique négative n'est pas appropriée lors de l'écoute active. L'objectif est de comprendre et de soutenir la victime de manière positive."
      }
  ]
},
{
  "text": "Quel est l'objectif principal de la respiration contrôlée lors d'une intervention de secours?",
  "answers": [
      {
          "text": "Accélérer le rythme respiratoire pour dynamiser la victime",
          "isCorrect": false,
          "comment": "L'objectif de la respiration contrôlée n'est pas d'accélérer le rythme respiratoire, mais plutôt d'induire une respiration relaxante pour détendre et calmer la victime."
      },
      {
          "text": "Induire une respiration relaxante pour détendre et calmer la victime",
          "isCorrect": true,
          "comment": "La respiration contrôlée vise principalement à induire une respiration relaxante pour détendre et calmer la victime, favorisant ainsi une meilleure gestion du stress."
      },
      {
          "text": "Mobiliser le système sympathique pour augmenter la vigilance",
          "isCorrect": false,
          "comment": "La respiration contrôlée vise à activer le système parasympathique pour favoriser la détente, plutôt que de mobiliser le système sympathique pour augmenter la vigilance."
      },
      {
          "text": "Favoriser une respiration rapide et superficielle pour stimuler la circulation sanguine",
          "isCorrect": false,
          "comment": "La respiration contrôlée n'a pas pour objectif de favoriser une respiration rapide et superficielle, mais plutôt une respiration relaxante pour détendre la victime."
      }
  ]
},
{
  "text": "Pourquoi est-il important de prolonger le temps d'expiration lors de la respiration contrôlée?",
  "answers": [
      {
          "text": "Pour augmenter la vigilance et l'activité musculaire de la victime",
          "isCorrect": false,
          "comment": "Prolonger le temps d'expiration favorise la détente en activant le système parasympathique, ce qui réduit la vigilance et l'activité musculaire."
      },
      {
          "text": "Pour favoriser la détente en activant le système parasympathique",
          "isCorrect": true,
          "comment": "Prolonger le temps d'expiration lors de la respiration contrôlée permet d'activer le système parasympathique, favorisant ainsi la détente et la relaxation de la victime."
      },
      {
          "text": "Pour induire une inspiration profonde et dynamisante",
          "isCorrect": false,
          "comment": "Prolonger le temps d'expiration ne vise pas à induire une inspiration profonde et dynamisante, mais plutôt à favoriser la détente en activant le système parasympathique."
      },
      {
          text: "Pour stimuler la sécrétion d'adrénaline et accélérer le rythme cardiaque",
          isCorrect: false,
          comment: "Prolonger le temps d'expiration ne vise pas à stimuler la sécrétion d'adrénaline, mais plutôt à favoriser la détente en activant le système parasympathique."
      }
  ]
},
{
  "text": "Quelle est la différence entre la respiration complète et la respiration abdominale?",
  "answers": [
      {
          text: "La respiration complète implique uniquement le thorax tandis que la respiration abdominale implique le ventre",
          isCorrect: false,
          comment: "La respiration complète mobilise les trois étages respiratoires, tandis que la respiration abdominale se concentre principalement sur le ventre."
      },
      {
          text: "La respiration complète mobilise les trois étages respiratoires tandis que la respiration abdominale se concentre sur le ventre",
          isCorrect: true,
          comment: "La principale différence entre la respiration complète et la respiration abdominale est que la première mobilise les trois étages respiratoires tandis que la seconde se concentre sur le ventre."
      },
      {
          text: "La respiration complète est plus dynamisante que la respiration abdominale",
          isCorrect: false,
          comment: "La dynamisation n'est pas une caractéristique exclusive de la respiration complète par rapport à la respiration abdominale."
      },
      {
          text: "La respiration complète est recommandée en cas de stress extrême",
          isCorrect: false,
          comment: "La recommandation de la respiration complète ou abdominale dépend de la situation et des besoins individuels, et non pas du niveau de stress."
      }
  ]
},
{
  "text": "Pourquoi est-il important que les volumes inspiratoires et expiratoires soient identiques lors de la respiration contrôlée?",
  "answers": [
      {
          text: "Pour favoriser une respiration superficielle et rapide",
          isCorrect: false,
          comment: "L'objectif n'est pas de favoriser une respiration superficielle et rapide, mais plutôt de maintenir une respiration équilibrée pour éviter une inspiration profonde."
      },
      {
          text: "Pour éviter une expiration forcée qui entraînerait une inspiration profonde",
          isCorrect: true,
          comment: "Il est important que les volumes inspiratoires et expiratoires soient identiques pour éviter une expiration forcée qui pourrait entraîner une inspiration profonde, ce qui contredirait l'objectif de relaxation."
      },
      {
          text: "Pour maximiser l'effet stimulant sur le système nerveux autonome",
          isCorrect: false,
          comment: "L'objectif de la respiration contrôlée n'est pas de maximiser l'effet stimulant sur le système nerveux autonome, mais plutôt de favoriser la relaxation et la détente."
      },
      {
          text: "Pour garantir une respiration dynamisante et énergisante",
          isCorrect: false,
          comment: "L'objectif de la respiration contrôlée n'est pas de garantir une respiration dynamisante et énergisante, mais plutôt de favoriser la détente et la relaxation."
      }
  ]
},
{
  "text": "Quels sont les risques potentiels associés à la respiration contrôlée lors d'une intervention de secours?",
  "answers": [
      {
          text: "Augmentation de la détente et de la relaxation chez la victime",
          isCorrect: false,
          comment: "La respiration contrôlée vise à favoriser la détente et la relaxation, plutôt qu'à augmenter ces états chez la victime."
      },
      {
          text: "Diminution de la vigilance et de la réponse aux stimuli externes",
          isCorrect: true,
          comment: "L'un des risques potentiels de la respiration contrôlée est la diminution de la vigilance et de la réponse aux stimuli externes, ce qui pourrait être préjudiciable dans certaines situations d'urgence."
      },
      {
          text: "Activation excessive du système sympathique chez la victime",
          isCorrect: false,
          comment: "Bien que la respiration contrôlée puisse activer le système parasympathique, elle n'entraîne généralement pas une activation excessive du système sympathique."
      },
      {
          text: "Amélioration de la coordination musculaire et de l'équilibre",
          isCorrect: false,
          comment: "Bien que la respiration contrôlée puisse avoir des effets bénéfiques sur le corps, tels que la détente musculaire, elle peut également présenter des risques, tels que la diminution de la vigilance."
      }
  ]
},
{
  "text": "Quel est l'objectif principal des techniques de focalisation et de défocalisation de l'attention lors d'une intervention de secours?",
  "answers": [
      {
          "text": "Accroître la vulnérabilité émotionnelle de la victime",
          "isCorrect": false,
          "comment": "Les techniques de focalisation et de défocalisation de l'attention visent plutôt à stabiliser l'état psychologique de la victime et à favoriser le bon déroulement de l'intervention, plutôt qu'à accroître sa vulnérabilité émotionnelle."
      },
      {
          "text": "Réduire la capacité de la victime à se concentrer",
          "isCorrect": false,
          "comment": "L'objectif n'est pas de réduire la capacité de la victime à se concentrer, mais plutôt de stabiliser son état psychologique pour faciliter l'intervention."
      },
      {
          "text": "Stabiliser l'état psychologique de la victime et favoriser le bon déroulement de l'intervention",
          "isCorrect": true,
          "comment": "Le principal objectif des techniques de focalisation et de défocalisation de l'attention est de stabiliser l'état psychologique de la victime et de favoriser le bon déroulement de l'intervention en limitant les effets négatifs du stress."
      },
      {
          "text": "Intensifier les facteurs de stress liés à l'événement critique",
          "isCorrect": false,
          "comment": "Les techniques de focalisation et de défocalisation de l'attention ont pour but de réduire les facteurs de stress plutôt que de les intensifier."
      }
  ]
},
{
  "text": "Quelles sont les tâches attentionnelles distractives utilisées pour la focalisation de l'attention?",
  "answers": [
      {
          "text": "Répéter des phrases stressantes pour la victime",
          "isCorrect": false,
          "comment": "Répéter des phrases stressantes n'est pas une technique utilisée pour la focalisation de l'attention, car cela pourrait aggraver l'état émotionnel de la victime."
      },
      {
          "text": "Poser des questions sur des sujets extérieurs à l'intervention",
          "isCorrect": true,
          "comment": "Poser des questions sur des sujets extérieurs à l'intervention est une tâche attentionnelle distractives couramment utilisée pour aider la victime à se concentrer sur autre chose que l'événement stressant."
      },
      {
          "text": "Demander à la victime de se concentrer sur les détails de l'événement critique",
          "isCorrect": false,
          "comment": "Demander à la victime de se concentrer sur les détails de l'événement critique ne constitue pas une tâche attentionnelle distractives, car cela pourrait renforcer le stress associé à l'événement."
      },
      {
          "text": "Augmenter la pression sur la victime pour la maintenir alerte",
          "isCorrect": false,
          "comment": "Augmenter la pression sur la victime n'est pas une technique de focalisation de l'attention, car cela pourrait aggraver son état émotionnel et augmenter le stress."
      }
  ]
},
{
  "text": "Pourquoi est-il important de préciser que les tâches d'ancrage visent à la stabilisation émotionnelle?",
  "answers": [
      {
          "text": "Pour augmenter la charge cognitive de la victime",
          "isCorrect": false,
          "comment": "Le but des tâches d'ancrage n'est pas d'augmenter la charge cognitive de la victime, mais plutôt de stabiliser ses émotions en lui fournissant des points de repère."
      },
      {
          "text": "Pour susciter une réaction de peur chez la victime",
          "isCorrect": false,
          "comment": "Les tâches d'ancrage visent à stabiliser émotionnellement la victime et non à susciter des réactions de peur."
      },
      {
          "text": "Pour éviter toute confusion chez la victime sur le but des exercices",
          "isCorrect": true,
          "comment": "Il est important de préciser que les tâches d'ancrage visent à la stabilisation émotionnelle pour éviter toute confusion chez la victime sur le but des exercices et pour garantir leur efficacité."
      },
      {
          "text": "Pour accélérer le processus de guérison",
          "isCorrect": false,
          "comment": "Bien que les tâches d'ancrage puissent contribuer au processus de guérison en favorisant la stabilité émotionnelle, leur objectif principal est de stabiliser émotionnellement la victime."
      }
  ]
},
{
  "text": "Quelle est la différence entre la visualisation conformiste et la visualisation créatrice?",
  "answers": [
      {
          "text": "La visualisation conformiste se concentre sur des objets réels, tandis que la visualisation créatrice imagine des scénarios abstraits.",
          "isCorrect": true,
          "comment": "La principale différence entre la visualisation conformiste et la visualisation créatrice est que la première se concentre sur des objets réels tandis que la seconde imagine des scénarios abstraits."
      },
      {
          "text": "La visualisation conformiste est accessible à tous, tandis que la visualisation créatrice est réservée aux personnes créatives.",
          "isCorrect": false,
          "comment": "La différence entre la visualisation conformiste et la visualisation créatrice réside dans leur approche respective, pas dans la capacité des individus à les pratiquer."
      },
      {
          "text": "La visualisation conformiste nécessite une concentration extrême, tandis que la visualisation créatrice est plus détendue.",
          "isCorrect": false,
          "comment": "La concentration requise pour la visualisation conformiste et la visualisation créatrice peut varier en fonction des préférences individuelles, mais cela n'est pas une différence fondamentale entre les deux."
      },
      {
          "text": "La visualisation conformiste provoque des changements physiologiques, tandis que la visualisation créatrice n'a aucun effet sur le corps.",
          "isCorrect": false,
          "comment": "La visualisation créatrice peut également provoquer des changements physiologiques, notamment en influençant les réponses émotionnelles et les niveaux de stress."
      }
  ]
},
{
  "text": "Quel est l'objectif principal de la visualisation dans la régulation du stress?",
  "answers": [
      {
          "text": "Créer des sensations de peur et d'anxiété chez la victime",
          "isCorrect": false,
          "comment": "L'objectif de la visualisation dans la régulation du stress n'est pas de créer des sensations de peur et d'anxiété, mais plutôt de susciter une réaction de détente et de bien-être chez la victime."
      },
      {
          "text": "Susciter une réaction de détente et de bien-être chez la victime",
          "isCorrect": true,
          "comment": "La visualisation dans la régulation du stress vise principalement à susciter une réaction de détente et de bien-être chez la victime, contribuant ainsi à atténuer les effets du stress."
      },
      {
          "text": "Accroître la vigilance de la victime face aux stimuli externes",
          "isCorrect": false,
          "comment": "La visualisation dans la régulation du stress ne vise pas à accroître la vigilance de la victime, mais plutôt à favoriser la relaxation et la réduction du stress."
      },
      {
          "text": "Stimuler la production d'adrénaline chez la victime",
          "isCorrect": false,
          "comment": "Stimuler la production d'adrénaline n'est pas l'objectif de la visualisation dans la régulation du stress, car cela pourrait aggraver la réaction de stress plutôt que de l'atténuer."
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
