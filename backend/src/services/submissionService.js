import { prisma } from '../database/client.js';

export const createSubmission = (data) => {
  return prisma.submission.create({ data });
};

export const getAllSubmissions = () => {
  return prisma.submission.findMany({ orderBy: { created_at: 'desc' } });
};

export const getSubmissionById = (id) => {
  return prisma.submission.findUnique({ where: { id } });
};

export const deleteSubmissionById = (id) => {
  return prisma.submission.delete({ where: { id } });
};


