<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\GateRemaining;
use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenFail;
use App\Domain\Gate\OpenRequest;
use App\Domain\Gate\OpenSuccess;
use App\Infrastructure\ManagerRegistry;
use function date_default_timezone_get;
use DateInterval;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\NoResultException;
use Ramsey\Uuid\UuidInterface;
use function sprintf;

final class DoctrineGateStorage implements GateStorage, GateRemaining
{
    private const TIMEOUT = 30;

    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    /**
     * {@inheritdoc}
     */
    public function addRequest(OpenRequest $request): void
    {
        $this->registry->getManager()->persist($request);
    }

    /**
     * {@inheritdoc}
     */
    public function addSuccess(OpenSuccess $success): void
    {
        $this->registry->getManager()->persist($success);
    }

    /**
     * {@inheritdoc}
     */
    public function addFail(OpenFail $fail): void
    {
        $this->registry->getManager()->persist($fail);
    }

    public function getRemainingTime(UuidInterface $gateId): int
    {
        try {
            $date = $this->registry->getManager()
                ->createQueryBuilder()
                ->select('t.createdAt')
                ->from(OpenSuccess::class, 't')
                ->where('t.gateId = :gateId')
                ->orderBy('t.createdAt', 'DESC')
                ->getQuery()
                ->setParameter('gateId', $gateId->toString())
                ->setMaxResults(1)
                ->getSingleScalarResult();
        } catch (NoResultException $e) {
            return 0;
        }

        $toUnlock = (new DateTimeImmutable($date))
            ->setTimezone(new DateTimeZone(date_default_timezone_get()))
            ->add(new DateInterval(sprintf('PT%sS', self::TIMEOUT)));

        $now = new DateTimeImmutable();

        if ($toUnlock < $now) {
            return 0;
        }

        return $toUnlock->diff($now)->s;
    }
}
