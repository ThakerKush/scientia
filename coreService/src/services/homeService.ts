import { DB } from '../db/models';
import config from '../config';
import { QueryTypes } from 'sequelize';

class homeService {
  getHome = async (category: keyof typeof config.constants.TASK_TYPE) => {
    try {
      console.log('CATOGERY', category);

      const results = await DB.sequelize.query(
        `
        SELECT COUNT(UT.task_id)   AS forks, T.uuid, T.title, T.type, T.content, Q.uuid as "quiz_uuid"
        FROM public.tasks T
                 LEFT JOIN public.user_tasks UT ON UT.task_id = T.id AND UT.is_forked = true
                 INNER JOIN public.quizs Q on T.id = Q.task_id
        WHERE T.is_public = true
        AND case when :category is not null then T.type = :category else true end
        GROUP BY T.id, UT.is_completed, UT.is_forked, Q.uuid
        ORDER BY forks DESC;
        `,
        { replacements: { category: category ?? null }, type: QueryTypes.SELECT }
      );
      return results;
    } catch (error) {
      console.error('[HomeService] Error while getting home', error);
      throw error;
    }
  };
}

export { homeService };
