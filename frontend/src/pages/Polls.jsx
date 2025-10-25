import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  HowToVote as VoteIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { fetchPolls, createPoll, votePoll } from '../redux/slices/pollSlice';
import { fetchClubs } from '../redux/slices/clubSlice';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';

const Polls = () => {
  const dispatch = useDispatch();
  const { pollList, loading } = useSelector((state) => state.polls);
  const { clubList } = useSelector((state) => state.clubs);
  const { user } = useSelector((state) => state.auth);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    options: ['', ''],
    category: 'general',
    type: 'single',
    endDate: '',
    allowAnonymous: false,
    visibility: 'public',
    club: '',
  });

  useEffect(() => {
    dispatch(fetchPolls({ category: filterCategory, isActive: filterStatus === 'active' }));
    dispatch(fetchClubs());
  }, [dispatch, filterCategory, filterStatus]);

  const handleCreatePoll = async () => {
    if (newPoll.options.filter(opt => opt.trim()).length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (!newPoll.endDate) {
      toast.error('Please select an end date for the poll');
      return;
    }

    if (!newPoll.question.trim()) {
      toast.error('Please enter a question for the poll');
      return;
    }

    try {
      const pollData = {
        ...newPoll,
        options: newPoll.options.filter(opt => opt.trim()),
        club: newPoll.club || undefined,
        // Ensure endDate is properly formatted as ISO string
        endDate: new Date(newPoll.endDate).toISOString(),
      };
      const result = await dispatch(createPoll(pollData)).unwrap();
      // Show the message from backend (approved or pending)
      toast.success(result.message || 'Poll created successfully!');
      setCreateDialogOpen(false);
      setNewPoll({
        question: '',
        description: '',
        options: ['', ''],
        category: 'general',
        type: 'single',
        endDate: '',
        allowAnonymous: false,
        visibility: 'public',
        club: '',
      });
    } catch (error) {
      toast.error(error || 'Failed to create poll');
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one option');
      return;
    }

    try {
      await dispatch(votePoll({ id: selectedPoll._id, optionIds: selectedOptions })).unwrap();
      toast.success('Vote submitted successfully!');
      setVoteDialogOpen(false);
      setSelectedPoll(null);
      setSelectedOptions([]);
    } catch (error) {
      toast.error(error || 'Failed to submit vote');
    }
  };

  const openVoteDialog = (poll) => {
    setSelectedPoll(poll);
    setSelectedOptions([]);
    setVoteDialogOpen(true);
  };

  const handleOptionChange = (optionId, isMultiple) => {
    if (isMultiple) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updateOption = (index, value) => {
    const updated = [...newPoll.options];
    updated[index] = value;
    setNewPoll({ ...newPoll, options: updated });
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      const updated = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({ ...newPoll, options: updated });
    }
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? ((votes / total) * 100).toFixed(1) : 0;
  };

  const hasVoted = (poll) => {
    return poll.options.some(opt => opt.votes.some(v => v._id === user?._id || v === user?._id));
  };

  const categories = ['campus', 'club', 'event', 'facility', 'general'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Campus Polls
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Poll
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3} display="flex" gap={2}>
        <TextField
          select
          label="Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>
      </Box>

      {/* Polls Grid */}
      <Grid container spacing={3}>
        {pollList.map((poll) => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
          const isExpired = isPast(new Date(poll.endDate));
          const userHasVoted = hasVoted(poll);

          return (
            <Grid item xs={12} md={6} key={poll._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {poll.question}
                    </Typography>
                    <Box>
                      <Chip
                        label={poll.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      {(isExpired || !poll.isActive) && (
                        <Chip label="Closed" size="small" color="error" />
                      )}
                      {userHasVoted && (
                        <Chip
                          icon={<CheckIcon />}
                          label="Voted"
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {poll.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {poll.description}
                    </Typography>
                  )}

                  {poll.club && (
                    <Chip label={poll.club.name} size="small" sx={{ mb: 2 }} />
                  )}

                  <Box mb={2}>
                    {poll.options.map((option) => (
                      <Box key={option._id} mb={1}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2">{option.text}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.votes.length} votes ({calculatePercentage(option.votes.length, totalVotes)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Number(calculatePercentage(option.votes.length, totalVotes))}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {totalVotes} total votes • Ends {format(new Date(poll.endDate), 'MMM dd, yyyy')}
                    </Typography>
                    {!userHasVoted && poll.isActive && !isExpired && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VoteIcon />}
                        onClick={() => openVoteDialog(poll)}
                      >
                        Vote
                      </Button>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Created by {poll.createdBy?.name || 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Poll Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Poll</DialogTitle>
        <DialogContent>
          {user?.role === 'faculty' && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2, 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Typography variant="body2" color="primary" fontWeight="600">
                ✨ Staff Privilege: Your polls will be published immediately without admin approval!
              </Typography>
            </Paper>
          )}
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Question"
              fullWidth
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              required
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={newPoll.description}
              onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
            />

            <Typography variant="subtitle2">Options</Typography>
            {newPoll.options.map((option, index) => (
              <Box key={index} display="flex" gap={1}>
                <TextField
                  label={`Option ${index + 1}`}
                  fullWidth
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {newPoll.options.length > 2 && (
                  <IconButton onClick={() => removeOption(index)}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={addOption} variant="outlined" size="small">
              Add Option
            </Button>

            <TextField
              select
              label="Category"
              fullWidth
              value={newPoll.category}
              onChange={(e) => setNewPoll({ ...newPoll, category: e.target.value })}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Type"
              fullWidth
              value={newPoll.type}
              onChange={(e) => setNewPoll({ ...newPoll, type: e.target.value })}
            >
              <MenuItem value="single">Single Choice</MenuItem>
              <MenuItem value="multiple">Multiple Choice</MenuItem>
            </TextField>

            <TextField
              select
              label="Club (Optional)"
              fullWidth
              value={newPoll.club}
              onChange={(e) => setNewPoll({ ...newPoll, club: e.target.value })}
            >
              <MenuItem value="">None - General Poll</MenuItem>
              {clubList.map((club) => (
                <MenuItem key={club._id} value={club._id}>
                  {club.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="End Date"
              type="datetime-local"
              fullWidth
              value={newPoll.endDate}
              onChange={(e) => setNewPoll({ ...newPoll, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              select
              label="Visibility"
              fullWidth
              value={newPoll.visibility}
              onChange={(e) => setNewPoll({ ...newPoll, visibility: e.target.value })}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="students">Students Only</MenuItem>
              <MenuItem value="club-members">Club Members Only</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePoll} variant="contained">Create Poll</Button>
        </DialogActions>
      </Dialog>

      {/* Vote Dialog */}
      <Dialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedPoll && (
          <>
            <DialogTitle>{selectedPoll.question}</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedPoll.description}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Select your choice{selectedPoll.type === 'multiple' && '(s)'}:
              </Typography>

              {selectedPoll.type === 'single' ? (
                <RadioGroup
                  value={selectedOptions[0] || ''}
                  onChange={(e) => handleOptionChange(e.target.value, false)}
                >
                  {selectedPoll.options.map((option) => (
                    <FormControlLabel
                      key={option._id}
                      value={option._id}
                      control={<Radio />}
                      label={option.text}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <FormGroup>
                  {selectedPoll.options.map((option) => (
                    <FormControlLabel
                      key={option._id}
                      control={
                        <Checkbox
                          checked={selectedOptions.includes(option._id)}
                          onChange={() => handleOptionChange(option._id, true)}
                        />
                      }
                      label={option.text}
                    />
                  ))}
                </FormGroup>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setVoteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleVote} variant="contained">Submit Vote</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Polls;
