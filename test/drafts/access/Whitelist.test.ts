import { should } from 'chai';
import { WhitelistInstance } from '../../../types/truffle-contracts';

const Whitelist = artifacts.require('./drafts/access/Whitelist.sol') as Truffle.Contract<WhitelistInstance>;
should();

// tslint:disable-next-line no-var-requires
const { itShouldThrow } = require('./../../utils');

contract('Whitelist', (accounts) => {
    let whitelist: WhitelistInstance;
    const root = accounts[0];
    const user1 = accounts[1];

    beforeEach(async () => {
        whitelist = await Whitelist.new();
    });

    it('isMember returns false for non existing memberships', async () => {
        assert.isFalse(await whitelist.isMember(user1));
    });


    it('addMember adds a member to the whitelist.', async () => {
        await whitelist.addMember(user1, { from: root });
        assert.isTrue(await whitelist.isMember(user1));
    });

    itShouldThrow(
        'addMember throws if the member already belongs to the whitelist.',
        async () => {
            await whitelist.addMember(user1, { from: root });
            await whitelist.addMember(user1, { from: root });
        },
        'Address is member already.',
    );

    itShouldThrow(
        'removeMember throws if the member doesn\'t belong to the whitelist.',
        async () => {
            await whitelist.removeMember(user1, { from: root });
        },
        'Not member of whitelist.',
    );

    it('removeMember removes a member from a role.', async () => {
        await whitelist.addMember(user1, { from: root });
        assert.isTrue(await whitelist.isMember(user1));
        await whitelist.removeMember(user1, { from: root });
        assert.isFalse(await whitelist.isMember(user1));
    });
});
