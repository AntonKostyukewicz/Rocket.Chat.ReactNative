import React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';

import shortnameToUnicode from '../../lib/methods/helpers/shortnameToUnicode';
import styles from './styles';
import CustomEmoji from './CustomEmoji';
import scrollPersistTaps from '../../lib/methods/helpers/scrollPersistTaps';
import { IEmoji, IEmojiCategory } from '../../definitions/IEmoji';

const MAX_EMOJI_SIZE = 50;

const renderEmoji = (emoji: IEmoji, size: number, baseUrl: string) => {
	if (emoji && emoji.isCustom) {
		return (
			<CustomEmoji
				style={[styles.customCategoryEmoji, { height: size - 16, width: size - 16 }]}
				emoji={emoji}
				baseUrl={baseUrl}
			/>
		);
	}
	return (
		<Text style={[styles.categoryEmoji, { height: size, width: size, fontSize: size - 14 }]}>
			{shortnameToUnicode(`:${emoji}:`)}
		</Text>
	);
};

const EmojiCategory = React.memo(({ baseUrl, onEmojiSelected, emojis, width, tabsCount, ...props }: IEmojiCategory) => {
	const emojiSize = width ? Math.min(width / tabsCount, MAX_EMOJI_SIZE) : MAX_EMOJI_SIZE;
	const numColumns = Math.trunc(width ? width / emojiSize : tabsCount);
	const renderItem = (emoji: IEmoji) => (
		<TouchableOpacity
			activeOpacity={0.7}
			// @ts-ignore
			key={emoji && emoji.isCustom ? emoji.content : emoji}
			onPress={() => onEmojiSelected(emoji)}
			testID={`reaction-picker-${emoji && emoji.isCustom ? emoji.content : emoji}`}>
			{renderEmoji(emoji, emojiSize, baseUrl)}
		</TouchableOpacity>
	);

	if (!width) {
		return null;
	}

	return (
		<FlatList
			// rerender FlatList in case of width changes
			key={`emoji-category-${numColumns}`}
			// @ts-ignore
			keyExtractor={item => (item && item.isCustom && item.content) || item}
			data={emojis}
			extraData={{ baseUrl, onEmojiSelected, width, ...props }}
			renderItem={({ item }) => renderItem(item)}
			numColumns={numColumns}
			initialNumToRender={45}
			removeClippedSubviews
			{...scrollPersistTaps}
		/>
	);
});

export default EmojiCategory;
