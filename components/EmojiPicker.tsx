
import React from 'react';

const EMOJIS = [
  '😀', '😂', '😍', '🤔', '👍', '🙏', '❤️', '🔥', '🎉', '👋',
  '😊', '😭', '😎', '😴', '👎', '🙌', '💔', '💯', '🚀', '👌'
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2">
      <div className="grid grid-cols-5 gap-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="text-2xl p-2 rounded-md hover:bg-gray-700 transition-colors duration-150"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
