from stats.selectors.folder import StatsSelector
from users.models import User


class UserStatsUseCase:
    def execute(self, user: User):
        return StatsSelector.get_user_stats(user)
