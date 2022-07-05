import React, { useContext } from 'react';
import { Text } from 'react-native';
import { Emoji as EmojiProps } from '@rocket.chat/message-parser';

import shortnameToUnicode from '../../../lib/methods/helpers/shortnameToUnicode';
import { themes } from '../../../lib/constants';
import { useTheme } from '../../../theme';
import styles from '../styles';
import CustomEmoji from '../../EmojiPicker/CustomEmoji';
import MarkdownContext from './MarkdownContext';

interface IEmojiProps {
	block: EmojiProps['value'];
	isBigEmoji?: boolean;
	shortCode?: string;
}

const Emoji = ({ block, isBigEmoji }: IEmojiProps) => {
	const { theme } = useTheme();
	const { baseUrl, getCustomEmoji } = useContext(MarkdownContext);

	if (block?.unicode) {
		return <Text style={[{ color: themes[theme].bodyText }, isBigEmoji ? styles.textBig : styles.text]}>{block.unicode}</Text>;
	}
	const emojiUnicode = shortnameToUnicode(block?.shortCode ? `:${block.shortCode}:` : `:${block.value?.value}:`);
	const emoji = getCustomEmoji?.(block.value?.value);

	if (emoji) {
		return <CustomEmoji baseUrl={baseUrl} style={[isBigEmoji ? styles.customEmojiBig : styles.customEmoji]} emoji={emoji} />;
	}
	return <Text style={[{ color: themes[theme].bodyText }, isBigEmoji ? styles.textBig : styles.text]}>{emojiUnicode}</Text>;
};

export default Emoji;
