const {
  channelCreateSchema,
  channelInviteSchema,
  channelAcceptInviteSchema,
} = require("../formSchemas/channelFormSchemas");
const Channel = require("../models/Channel");
const MemberRoles = require("../models/Consts/MemberRoles");
const SpaceMemberRoles = require("../models/Consts/SpaceMemberRoles");
const Invitation = require("../models/Invitation");
const Member = require("../models/Members");
const Space = require("../models/Space");
const SpaceMember = require("../models/SpaceMember");
const emailService = require("../transporter/emailService");

const channelController = {
  create: async (req, res) => {
    try {
      await channelCreateSchema.validate(req.body);
      const { channelName, adminName, channelDescription } = req.body;
      const newChannel = new Channel({
        name: channelName,
        description: channelDescription,
        adminName: adminName,
        adminId: req.user._id,
      });

      const savedChannel = await newChannel.save();
      const newMember = new Member({
        memberName: savedChannel.adminName,
        channel: savedChannel._id,
        user: req.user._id,
        role: MemberRoles.ADMIN,
      });

      await newMember.save();

      const general = await Space({
        name: "general",
        description: channelDescription,
        channel: newChannel._id,
        adminId: req.user._id,
      });

      await general.save();

      const spaceMember = await SpaceMember({
        space: general._id,
        member: newMember._id,
        role: SpaceMemberRoles.ADMIN,
      });

      await spaceMember.save();

      res.json({
        _id: savedChannel._id,
        name: savedChannel.name,
        description: savedChannel.description,
        adminName: savedChannel.adminName,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
  list: async (req, res) => {
    try {
      const memberChannels = await Member.find({
        user: req.user._id,
      })
        .populate("channel")
        .sort({ createdAt: -1 });
      res.json(memberChannels);
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
  invite: async (req, res) => {
    try {
      const channelId = req.params.channelId;

      const channel = await Channel.findById(channelId);

      if (req.user._id !== channel.adminId) {
        res.status(403).json({
          message: "This user is not admin",
        });
        return;
      }

      if (channel) {
        await channelInviteSchema.validate(req.body);
        const { emails: body_emails } = req.body;
        const emails = [...new Set(body_emails)];

        const invitations = [];

        await Promise.all(
          emails.map(async (email) => {
            await Invitation.findOneAndDelete({
              email,
              channel: channelId,
            });

            const invitation = new Invitation({
              email,
              channel: channelId,
            });
            const newinvitation = await invitation.save();
            invitations.push({ email, invitation: newinvitation });
          })
        );

        const data = {
          invitations: invitations,
          channel: channel,
        };

        emailService.sendChannelInvitationNotification(data);

        res.json({
          message: "Invitations sent successfully",
        });
      } else {
        res.status(404).json({
          message: "Channel Not Found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  acceptChannelInvitation: async (req, res) => {
    try {
      await channelAcceptInviteSchema.validate(req.body);
      const { invitationId } = req.body;
      const invite = await Invitation.findById(invitationId);
      if (req.user.email === invite?.email) {
        const is_member = await Member.findOne({
          channel: invite.channel,
          user: req.user._id,
        });
        if (is_member) {
          await Invitation.findByIdAndDelete(invitationId);
          res.status(403).json({
            message: "No Invitation Found",
          });
        } else {
          const newMember = new Member({
            memberName: `${req.user.firstName} ${req.user.lastName}`,
            channel: invite.channel,
            user: req.user._id,
            role: MemberRoles.MEMBER,
          });

          await newMember.save();
          await Invitation.findByIdAndDelete(invitationId);
          res.json({
            channelId: invite.channel._id,
            message: "Invite Accepted",
          });
        }
      } else {
        res.status(403).json({
          message: "No Invitation Found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
};

module.exports = channelController;
