import React from "react";

type FormattedTextProps = {
  text: string;
};

const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  // Fonction pour extraire les parties à mettre en gras et le reste du texte
  const formatText = (text: string) => {
    const regex = /\*\*(.*?)\*\*/g; // Regex pour trouver **texte**
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(regex, (match, boldText, index) => {
      // Ajout du texte avant le mot en gras
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }
      // Ajout du texte en gras
      parts.push(
        <strong key={index} className="font-bold">
          {boldText}
        </strong>
      );
      lastIndex = index + match.length;
      return match;
    });

    // Ajout du texte restant après le dernier mot en gras
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return <p className="text-sm">{formatText(text)}</p>;
};

export default FormattedText;
