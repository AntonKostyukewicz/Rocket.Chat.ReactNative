import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import Emoji from './message/Emoji';
import { useTheme } from '../theme';
import { TGetCustomEmoji } from '../definitions/IEmoji';
import { TMessageModel, IReaction } from '../definitions';
import UserItem from './UserItem';

const styles = StyleSheet.create({
	reactionsListContainer: { height: '100%', width: '100%' },
	tabBarItem: {
		paddingHorizontal: 10,
		paddingBottom: 10,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	reactionCount: { marginLeft: 5 },
	tabLine: { position: 'absolute', left: 0, right: 0, bottom: 0 },
	emojiName: { margin: 10 }
});
const standardEmojiStyle = { fontSize: 20, color: '#fff' };
const customEmojiStyle = { width: 25, height: 25 };

interface ISharedFields {
	baseUrl: string;
	getCustomEmoji: TGetCustomEmoji;
}

interface IReactionsListProps extends ISharedFields {
	message?: TMessageModel;
}

interface ITabBarItem extends ISharedFields {
	tab: IReaction;
	index: number;
	activeTab?: number;
	goToPage?: (index: number) => void;
}
interface IReactionsTabBar extends ISharedFields {
	activeTab?: number;
	tabs?: IReaction[];
	goToPage?: (index: number) => void;
}

const TabBarItem = React.memo(({ tab, index, goToPage, activeTab, baseUrl, getCustomEmoji }: ITabBarItem) => {
	const { colors } = useTheme();
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			key={tab.emoji}
			onPress={() => {
				goToPage?.(index);
			}}>
			<View style={styles.tabBarItem}>
				<Emoji
					content={tab.emoji}
					standardEmojiStyle={standardEmojiStyle}
					customEmojiStyle={customEmojiStyle}
					baseUrl={baseUrl}
					getCustomEmoji={getCustomEmoji}
				/>
				<Text style={[styles.reactionCount, { color: colors.auxiliaryTintColor }]}>{tab.usernames.length}</Text>
			</View>
			<View
				style={[
					styles.tabLine,
					activeTab === index
						? { backgroundColor: colors.tintColor, height: 2 }
						: {
								backgroundColor: colors.separatorColor,
								height: 1
						  }
				]}
			/>
		</TouchableOpacity>
	);
});

const ReactionsTabBar = React.memo(({ tabs, ...props }: IReactionsTabBar) => (
	<View>
		<FlatList
			data={tabs}
			keyExtractor={item => item.emoji}
			horizontal
			showsHorizontalScrollIndicator={false}
			renderItem={({ item, index }) => <TabBarItem tab={item} index={index} {...props} />}
		/>
	</View>
));

const List = React.memo(({ tabLabel }: { tabLabel: IReaction }) => {
	const { colors } = useTheme();
	const { emoji, usernames } = tabLabel;
	return (
		<View>
			<View style={styles.emojiName}>
				<Text style={{ color: colors.auxiliaryTintColor }}>{emoji}</Text>
			</View>
			<FlatList
				data={usernames}
				renderItem={({ item }: { item: string }) => (
					// TODO : Name should also be displayed in the user item
					<UserItem name={item} username={item} onPress={() => {}} testID={`reactions-list-item-${item}`} />
				)}
			/>
		</View>
	);
});

const ReactionsList = React.memo(({ message, ...props }: IReactionsListProps) => {
	// sorting reactions in descending order on the basic of number of users reacted
	const sortedReactions = message?.reactions?.sort(
		(reaction1, reaction2) => reaction2.usernames.length - reaction1.usernames.length
	);

	return (
		<View style={styles.reactionsListContainer}>
			<ScrollableTabView renderTabBar={() => <ReactionsTabBar {...props} />}>
				{sortedReactions?.map(reaction => (
					<List tabLabel={reaction} />
				))}
			</ScrollableTabView>
		</View>
	);
});

export default ReactionsList;
