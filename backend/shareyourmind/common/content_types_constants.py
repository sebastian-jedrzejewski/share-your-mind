from shareyourmind.polls.models import Poll
from shareyourmind.questions.models import Question

OBJECT_CONTENT_TYPES = (
    (Question.OBJECT_CONTENT_TYPE, Question.OBJECT_CONTENT_TYPE),
    (Poll.OBJECT_CONTENT_TYPE, Poll.OBJECT_CONTENT_TYPE),
)
